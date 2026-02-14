import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Branch } from '@app/modules/branch/models/entities/branch.entity';
import { User } from '@app/modules/user/models/entities/user.entity';
import { Product } from '@app/modules/product/models/entities/product.entity';
import { Sale, SaleStatus } from './models/entities/sale.entity';
import { Stock } from '../stok/models/entities/stok.entity';
import {
  StockMovement,
  StockMovementType,
} from '../stok/models/entities/stock-movement.entity';
import { CreateSaleDto } from './common/dtos/create-sale.dto';
import { SaleItem } from './models/entities/sale-item.entity';

@Injectable()
export class SaleService {
  constructor(
    @InjectDataSource() private readonly ds: DataSource,
    @InjectRepository(Sale) private readonly saleRepo: Repository<Sale>,
    @InjectRepository(SaleItem) private readonly itemRepo: Repository<SaleItem>,
    @InjectRepository(Branch) private readonly branchRepo: Repository<Branch>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Stock) private readonly stockRepo: Repository<Stock>,
    @InjectRepository(StockMovement)
    private readonly moveRepo: Repository<StockMovement>,
  ) {}

  async create(dto: CreateSaleDto) {
    return this.ds.transaction(async (em) => {
      const branch = await em.findOne(Branch, { where: { id: dto.branchId } });
      if (!branch) throw new NotFoundException('Branch not found');
      const cashier = await em.findOne(User, { where: { id: dto.cashierId } });
      if (!cashier) throw new NotFoundException('Cashier not found');

      if (!dto.items?.length)
        throw new BadRequestException('Sale items required');

      // Create sale
      const sale = em.create(Sale, {
        number: dto.number,
        branch,
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
        let stock = await em.findOne(Stock, {
          where: { product: { id: product.id }, branch: { id: branch.id } },
          relations: { product: true, branch: true },
        });
        if (!stock) {
          stock = em.create(Stock, { product, branch, quantity: '0' });
          await em.save(stock);
        }

        // Check qty
        const current = Number(stock.quantity);
        const qty = Number(it.quantity);
        if (current < qty)
          throw new BadRequestException(
            `Insufficient stock for ${product.name}`,
          );

        stock.quantity = (current - qty).toFixed(3);
        await em.save(stock);

        // Movement
        const mv = em.create(StockMovement, {
          product,
          branch,
          type: StockMovementType.SALE,
          quantity: it.quantity,
          reference: sale.id,
          note: `Sale ${sale.number}`,
        });
        await em.save(mv);

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
        relations: { items: { product: true }, branch: true, cashier: true },
      });
    });
  }

  findAll() {
    return this.saleRepo.find({
      relations: { branch: true, cashier: true },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.saleRepo.findOne({
      where: { id },
      relations: { items: { product: true }, branch: true, cashier: true },
    });
  }
}
