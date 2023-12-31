import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserStatus } from '../entities/user.status.entity';
import { NotFoundException } from '@nestjs/common/exceptions';

describe('UserRepository', () => {
  let repository: UserRepository;
  let dataSource: {
    createEntityManager: jest.Mock;
  };
  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Get user by id', () => {
    const currentDate = new Date();
    const id = 'some_uuid';

    const expectedOutput: User = {
      id,
      name: 'User1',
      lastname: 'lastname1',
      username: 'user1',
      passwordHash: 'passwordHash1',
      createdAt: currentDate,
      updatedAt: currentDate,
      status: null,
      roles: [],

    };

    it('should call findOne with correct user id', () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => expectedOutput);
      repository.getById(id);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return correct user data', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => expectedOutput);
      expect(await repository.getById(id)).toEqual(expectedOutput);
    });

    it('should throw NotFoundError when no user found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      try {
        await repository.getById(id);
      } catch (error) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });
  });
});
