import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ClientsModule } from '../clients/clients.module';
import { VendorsModule } from '../vendors/vendors.module';

@Module({
  imports: [
    ClientsModule,
    VendorsModule,
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
