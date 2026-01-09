export class MoneyUtil {
  static toRupiah(value: number): string {
    // Change as needed
    return `${value.toLocaleString('id-ID')}`;
  }

  static normalize(value: string): number {
    return parseFloat(value.replace(/[^0-9.-]+/g, ''));
  }
}
