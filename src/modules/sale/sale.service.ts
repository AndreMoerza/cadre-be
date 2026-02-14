import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '@app/modules/user/models/entities/user.entity';
import { Product } from '@app/modules/product/models/entities/product.entity';
import { Sale, SaleStatus } from './models/entities/sale.entity';
import { CreateSaleDto } from './common/dtos/create-sale.dto';
import { SaleItem } from './models/entities/sale-item.entity';
import { AppUser } from '@app/interfaces/index.type';

@Injectable()
export class SaleService {
  constructor(
    @InjectDataSource() private readonly ds: DataSource,
    @InjectRepository(Sale) private readonly saleRepo: Repository<Sale>,
    @InjectRepository(SaleItem) private readonly itemRepo: Repository<SaleItem>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateSaleDto, me: AppUser) {
    return this.ds.transaction(async (em) => {
      const cashier = await em.findOne(User, { where: { id: me.sub } });
      if (!cashier) throw new NotFoundException('Cashier not found');

      if (!dto.items?.length)
        throw new BadRequestException('Sale items required');

      // Create sale
      const sale = em.create(Sale, {
        cashier,
        status: SaleStatus.COMPLETED,
        subtotal: dto.subtotal,
        discountTotal: dto.discountTotal,
        taxTotal: dto.taxTotal,
        grandTotal: dto.grandTotal,
        paidAmount: dto.paidAmount,
        dueAmount: dto.dueAmount,
      });
      await em.save(sale);

      // Items + stock deduction
      for (const it of dto.items) {
        const product = await em.findOne(Product, {
          where: { id: it.productId },
        });
        if (!product)
          throw new NotFoundException(`Product not found: ${it.productId}`);

        // upsert stock row
        const current = Number(product.realStock);
        const qty = Number(it.quantity);
        if (current < qty)
          throw new BadRequestException(
            `Insufficient stock for ${product.name}`,
          );

        product.realStock = (current - qty).toFixed(3);
        await em.save(product);

        // Sale item
        const item = em.create(SaleItem, {
          sale,
          product,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          discount: it.discount,
          lineTotal: (
            Number(it.quantity) * Number(it.unitPrice) -
            Number(it.discount)
          ).toFixed(2),
        });
        await em.save(item);
      }

      return em.findOne(Sale, {
        where: { id: sale.id },
        relations: { items: { product: true }, cashier: true },
      });
    });
  }

  findAll() {
    return this.saleRepo.find({
      relations: { cashier: true },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.saleRepo.findOne({
      where: { id },
      relations: { items: { product: true }, cashier: true },
    });
  }
}
