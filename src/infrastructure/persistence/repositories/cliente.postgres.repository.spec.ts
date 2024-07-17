// import { Test, TestingModule } from '@nestjs/testing';
// import { ClientePostgresRepository } from './cliente.postgres.repository';
// import { PrismaService } from '../prisma/prisma.service';
// import { Cliente } from 'src/core/cliente/entity/cliente.entity';

// describe('ClientePostgresRepository', () => {
//     let repository: ClientePostgresRepository;
//     let prismaService: PrismaService;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 ClientePostgresRepository,
//                 {
//                     provide: PrismaService,
//                     useValue: {
//                         cliente: {
//                             create: jest.fn(),
//                             findMany: jest.fn(),
//                         },
//                     },
//                 },
//             ],
//         }).compile();

//         repository = module.get<ClientePostgresRepository>(ClientePostgresRepository);
//         prismaService = module.get<PrismaService>(PrismaService);
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     describe('cadastrar', () => {
//         it('Deve ser possível criar um novo cliente', async () => {
//             const mockCliente: Cliente = { cpf: "123", email: "test@test.com", nome: "test" };
//             const mockCreatedCliente: Cliente = { cpf: "123", email: "test@test.com", nome: "test" };

//             (prismaService.cliente.create as jest.Mock).mockResolvedValue(mockCreatedCliente);

//             const result = await repository.cadastrar(mockCliente);

//             expect(prismaService.cliente.create).toHaveBeenCalledWith({ data: mockCliente });
//             expect(result).toEqual(mockCreatedCliente);
//         });
//     });

//     describe('getCliente', () => {
//         it('Deve ser possível retornar um cliente por email ou cpf', async () => {
//             const mockEmailOrCpf = 'test@test.com';
//             const mockClients: Cliente[] = [{ cpf: "123", email: "test@test.com", nome: "test" }];

//             (prismaService.cliente.findMany as jest.Mock).mockResolvedValue(mockClients);

//             const result = await repository.getCliente(mockEmailOrCpf);

//             expect(prismaService.cliente.findMany).toHaveBeenCalledWith({
//                 where: {
//                     OR: [
//                         { email: mockEmailOrCpf },
//                         { cpf: mockEmailOrCpf },
//                     ],
//                 },
//             });
//             expect(result).toEqual(mockClients);
//         });

//     });
// });
