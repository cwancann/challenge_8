const AuthenticationController = require("./AuthenticationController");
const { JWT_SIGNATURE_KEY } = require("../../config/application");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");

describe("AuthenticationController", () => {
  describe("handleRegister", () => {
    it("should register user", async () => {
      const name = "Candra";
      const email = "candrapramudya50@gmail.com";
      const password = "cancan123";

      const mockRequest = {
        body: {
          name: name,
          email: email,
          password: password,
        },
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const mockNext = {};

      const mockUser = new User({ name, email, password });
      const mockUserModel = {};
      mockUserModel.findOne = jest.fn().mockReturnValue(mockUser);
      const app = new AuthenticationController({ userModel: mockUserModel });
      await app.handleRegister(
        mockRequest,
        mockResponse,
        mockNext
      );
    });
  });

  describe("createTokenFromUser", () => {
    it("it should create new token", async () => {
      const mockUser = {
        id: 1,
        name: "Candra",
        email: "candrapramudya50@gmail.com",
        image: "boboboi.jpg"};

      const mockRole = {
        id: 1,
        name: "ADMIN",
      };
 

      const token = jwt.sign(
        {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          image: mockUser.image,
          role: {
            id: mockRole.id,
            name: mockRole.name,
          },
        },
        JWT_SIGNATURE_KEY
      );

      const app = new AuthenticationController({ jwt: jwt });
      const result = await app.createTokenFromUser(mockUser, mockRole);
      const hasil = jest.fn();
      hasil.mockReturnValue(result);

      expect(result).toEqual(token);
    });
  });

  describe("decodeToken", () => {
    it("should decode token", async () => {
      const mockUser = {
        id: 1,
        name: "Candra",
        email: "candrapramudya50@gmail.com",
        image: "boboboi.jpg"};
        
      const mockRole = {
        id: 1,
        name: "ADMIN",
      };

      const token = jwt.sign(
        {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          image: mockUser.image,
          role: {
            id: mockRole.id,
            name: mockRole.name,
          },
        },
        JWT_SIGNATURE_KEY
      );

      const decoded = jwt.verify(token, JWT_SIGNATURE_KEY);
      const app = new AuthenticationController({ jwt: jwt });
      const result = await app.decodeToken(token);

      expect(result).toEqual(decoded);
    });
  });

  describe("encryptPassword", () => {
    it("should encrypt the password", async () => {
      const password = "1ewqm6psna";

      const encrypt = bcrypt.hashSync(password, 10);
      const app = new AuthenticationController({
        jwt: jwt,
        bcrypt: bcrypt,
      });

      const result = await app.encryptPassword(password);

      expect(result.slice(0, -53)).toEqual(encrypt.slice(0, -53));
    });
  });

  describe("verifyPassword", () => {
    it("should verify password and encrypted one", async () => {
      const password = "vtf1d4nglw";

      const encrypt = bcrypt.hashSync(password, 10);
      const verif = bcrypt.compareSync(password, encrypt);

      const app = new AuthenticationController({
        jwt: jwt,
        bcrypt: bcrypt,
      });

      const result = await app.verifyPassword(password, encrypt);

      expect(result).toEqual(verif);
    });
  });
});
