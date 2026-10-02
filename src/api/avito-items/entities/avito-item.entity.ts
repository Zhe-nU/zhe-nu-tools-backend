export class AvitoItemEntity {
  declare id: string;
  declare avitoId: number;
  declare title: string;
  declare url: string;
  declare status: string;
  declare category: {
    id: number;
    name: string;
  };
}
