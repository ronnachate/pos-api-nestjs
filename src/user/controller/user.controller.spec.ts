import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { LoggerService } from '../../shared/logger/logger.service';
import { UserPaginationParams } from '../query-params/pagination-params';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { INTERNAL_SERVER_ERROR_MSG } from '../../shared/constant/generic';
import { CreateUserDTO } from '../dtos/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  const mockedUserService = {
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), error: jest.fn() };

  const currentDate = new Date();
  const user3 = {
    id: 'uuid3',
    title: 'tiel',
    name: 'User3',
    username: 'user3',
    lasname: 'lastname3',
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    status: null,
  };

  const user4 = {
    id: 'uuid4',
    title: 'title',
    name: 'User4',
    username: 'user4',
    lasname: 'lastname4',
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
    status: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockedUserService },
        { provide: LoggerService, useValue: mockedLogger },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get Users as a list', () => {
    const page = 1;
    const rows = 10;
    const resultCount = 2;
    const query: UserPaginationParams = {
      page: page,
      rows: rows,
      status: undefined,
    };

    it('should call getUsers function', () => {
      mockedUserService.getUsers.mockResolvedValue({ users: [], count: 0 });
      controller.getUsers(query);
      expect(mockedUserService.getUsers).toHaveBeenCalled();
    });

    it('should return correct result', async () => {
      const pagination = { page: page, rows: rows, count: resultCount };
      mockedUserService.getUsers.mockResolvedValue({
        users: [user3, user4],
        count: resultCount,
      });
      var result = await controller.getUsers(query);
      expect(result.items).toEqual([user3, user4]);
      expect(result.pagination).toEqual(pagination);
    });

    it('should thrown error with generic internal error msg', async () => {
      mockedUserService.getUsers.mockRejectedValue(
        new InternalServerErrorException()
      );
      try {
        await controller.getUsers(query);
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(500);
        expect(errorResponse.error).toEqual(INTERNAL_SERVER_ERROR_MSG);
      }
    });
  });

  describe('Get user by id', () => {
    it('should return correct user', async () => {
      mockedUserService.getUserById.mockResolvedValue(user3);

      expect(await controller.getUser(user3.id)).toEqual(user3);
      expect(mockedUserService.getUserById).toHaveBeenCalledWith(user3.id);
    });

    it('should thrown error with generic internal error msg', async () => {
      mockedUserService.getUserById.mockRejectedValue(
        new InternalServerErrorException()
      );
      try {
        await controller.getUser('some_uuid');
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(500);
        expect(errorResponse.error).toEqual(INTERNAL_SERVER_ERROR_MSG);
      }
    });

    it('should thrown error 404 when service thrown NotFoundException', async () => {
      mockedUserService.getUserById.mockRejectedValue(
        new NotFoundException()
      );
      try {
        await controller.getUser('some_uuid');
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(404);
      }
    });
  });

  describe('Create user', () => {
    const input = new CreateUserDTO();
    it('Create user should return corect user', async () => {
      const userDto = {
        name: 'user5',
        username: 'user5',
      };
      mockedUserService.createUser.mockResolvedValue(userDto);

      expect(await controller.createUser(input)).toEqual(userDto);
    });

    it('should thrown error with generic internal error msg', async () => {
      mockedUserService.createUser.mockRejectedValue(
        new InternalServerErrorException()
      );
      try {
        await controller.createUser(input);
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(500);
        expect(errorResponse.error).toEqual(INTERNAL_SERVER_ERROR_MSG);
      }
    });
  });
});
