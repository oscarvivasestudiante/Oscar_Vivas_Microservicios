import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

function toBoolean(value: unknown, fallback: boolean): boolean {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
    }

    return fallback;
}

function toNumber(value: unknown, fallback: number): number {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : fallback;
}

export const DatabaseProvider: DynamicModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') ?? configService.get('HOST') ?? 'localhost',
        port: toNumber(
            configService.get('DB_PORT') ?? configService.get('PORT_DB'),
            5434,
        ),
        username:
            configService.get('DB_USER') ??
            configService.get('USERNAME_DB') ??
            'archivos_user',
        password:
            configService.get('DB_PASSWORD') ??
            configService.get('PASSWORD_DB') ??
            'archivos_password',
        database: configService.get('DB_NAME') ?? configService.get('DATABASE') ?? 'academy-file',
        entities: [],
        autoLoadEntities: toBoolean(configService.get('AUTO_LOAD_ENTITIES'), true),
        synchronize: toBoolean(configService.get('DB_SYNCHRONIZE'), false),
    }),
});
