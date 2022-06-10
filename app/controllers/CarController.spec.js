const CarController = require("./CarController");
const {
    Car
} = require("../models");

describe("CarController", () => {
    describe('handleCreateCar', () => {
        it('success result', async () => {
            const payloadCar = {
                name: "Fortuner",
                price: 50000,
                size: "large",
                image: "https://qph.fs.quoracdn.net/main-qimg-9e5badbfd164b06ad12360cf65e20dbd",
                isCurrentlyRented: false,
            };
    
            const mockModel = {}
    
            const mockTest = new Car(payloadCar)
    
            mockModel.create = jest.fn().mockReturnValue(mockTest)
    
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
    
            const mockRequest = {
                body: {
                    payloadCar,
                }
            };
    
            const app = new CarController({
                carModel: mockModel
            });
    
            const hasil = mockModel.create(payloadCar)
    
            await app.handleCreateCar(mockRequest, mockResponse)
    
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(hasil);
        });
    
        it('error result', async () => {
            const err = new Error("not Found!");
    
            const payloadCar = {
                name: "Toyota",
                price: 50000,
                size: "large",
                image: "https://media.suara.com/pictures/970x544/2021/10/19/91347-toyota-bz4x-01.jpg",
                isCurrentlyRented: false,
            };
    
            const mockModel = {}
    
            mockModel.create = jest.fn().mockReturnValue(Promise.reject(err))
    
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
    
            const mockRequest = {
                body: {
                    payloadCar,
                }
            };
    
            const app = new CarController({
                carModel: mockModel
            });
    
            await app.handleCreateCar(mockRequest, mockResponse)
    
            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: {
                    name: err.name,
                    message: err.message,
                }
            });
        });
    });

    describe('getCarFromrequest', () => {
        it("should test getCarFromRequest ", async () =>{

            const name = "Lancer";
            const prompt = "Evo x";

            const mockRequest = {
                param: {
                    id: 1
                }
            }

            const mockCar = new Car({name, prompt})
            const mockCarModel = {}
            mockCarModel.findByPk = jest.fn().mockRequestValue(mockCar)

            const carcontroller = new CarController({carModel: mockCarModel});
            const result = await carcontroller.getCarFromRequest(mockRequest);

            expect(result).toStrictEqual(mockCar)
        })
    })

    describe('handleDeleteCar', () => {
        it("should Delete Car object", async () => {

            const name = "Toyota"
            const prompt = "Kijang";

            const mockRequest = {
                params: {
                    id: 1 
                }
            }

            new Car({name, prompt})
            const mockCarModel = {}
            mockCarModel.destroy = jest.fn().mockReturnThis();
            
            const mockResponse = {};
            mockRequest.status = jest.fn().mockReturnThis();
            mockRequest.end = jest.fn().mockReturnThis();

            const carcontroller = new CarController({carModel: mockCarModel});
            await carcontroller.handleDeleteCar(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.end).toHaveBeenCalled()
        })
    })

    describe("handleGetCar", () => {
        it("should return a value", async () => {
            const name = "mobil";
            const prompt = "sedan";

            const mockRequest = {
                params: {
                    id: 1
                }
            };

            const mockCar = new Car({name, prompt})
            const mockCarModel = {}
            mockCarModel.findByPk = jest.fn().mockReturnValue(mockCar)
            const app = new CarController({carModel: mockCarModel});

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await app.handleGetCar(mockRequest, mockResponse);
            const result = await app.getCarFromRequest(mockRequest);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(result)
        })
    });

    describe("handleListCars",() => {
        it("should test handleListCars function", async () => {

            const name = "Suzuki"
            const prompt = "karimun"

            const mockRequest = {
                query: {
                    page: 1,
                    pageSize: 10
                }
            }
            const mockCarModel = {}
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            const app = new CarController({carModel: mockCarModel})
            await app.handleListCars(mockRequest, mockResponse);
            const mockCar = new Car({name, prompt});
            mockCarModel.findAll = jest.fn().mockReturnValue(mockCar)
            const carCount = mockCarModel.count = jest.fn().mockReturnValue({
                where: query.where,
                include: query.include
            })
            const query = app.getListQueryFromRequest(mockRequest)
            app.buildPaginationObject(mockRequest, carCount)

            expect(mockResponse.status).toHaveBeenCalledWith(200);
        })
    })

    describe("#handleUpdateCar", () => {
        it("should return the updated Car list", async () => {
            const mockRequest = {};
            const {name, price, size, image} = mockRequest.body;

            const mockCarModel = {};
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            }

            const app = new CarController({carModel: mockCarModel})

            const car = await app.getCarFromRequest(mockRequest);

            await car.update({
                name,
                price,
                size,
                image,
                isCurrentlyRented: false
            })

            await app.handleUpdateCar(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json),toHaveBeenCalledWith(car);
        })
    });
})
