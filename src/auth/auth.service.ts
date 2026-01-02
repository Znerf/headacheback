import { Injectable, ConflictException, UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { User } from '../schemas/user.schema';
import { SignUpDto, LoginDto, UpdateProfileDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, name, city, state, country, latitude, longitude } = signUpDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const location = await this.buildLocation({ city, state, country, latitude, longitude });
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
      location,
    });

    const tokens = await this.generateTokens(user._id.toString());
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      user: this.toUserResponse(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user._id.toString());
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      user: this.toUserResponse(user),
      ...tokens,
    };
  }

  async updateProfile(userId: string, payload: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (payload.name) {
      user.name = payload.name;
    }

    const { city, state, country, latitude, longitude } = payload;
    if (
      city !== undefined ||
      state !== undefined ||
      country !== undefined ||
      latitude !== undefined ||
      longitude !== undefined
    ) {
      user.location = await this.buildLocation({
        city: city ?? user.location?.city,
        state: state ?? user.location?.state,
        country: country ?? user.location?.country,
        latitude: latitude ?? user.location?.latitude,
        longitude: longitude ?? user.location?.longitude,
      });
    }

    const saved = await user.save();
    return this.toUserResponse(saved);
  }

  async refreshTokens(userId: string) {
    const tokens = await this.generateTokens(userId);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
  }

  private toUserResponse(user: User) {
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      location: user.location ?? null,
    };
  }

  private async buildLocation({
    city,
    state,
    country,
    latitude,
    longitude,
  }: {
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  }) {
    this.logger.debug('Saving location data');
    return { city, state, country, latitude, longitude };
  }

  private async generateTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRATION,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRATION,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }
}
