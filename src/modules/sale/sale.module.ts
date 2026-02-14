import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleProviderModule } from './providers/provider.module';
import { Sale } from './models/entities/sale.entity';
import { Branch } from '../branch/models/entities/branch.entity';
import { SaleItem } from './models/entities/sale-item.entity';
import { User } from '../user/models/entities/user.entity';
import { Product } from '../product/models/entities/product.entity';
import { Stock } from '../stok/models/entities/stok.entity';
import { StockMovement } from '../stok/models/entities/stock-movement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sale,
      SaleItem,
      Branch,
      User,
      Product,
      Stock,
      StockMovement,
    ]),
    SaleProviderModule,
  ],
  providers: [SaleService],
  exports: [],
  controllers: [SaleController],
})
export class SaleModule {}
