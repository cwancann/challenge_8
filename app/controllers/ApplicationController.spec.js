const ApplicationController = require("./ApplicationController");
const {
    NotFoundError
} = require ("../errors");


describe("handleGetRoot", () => {
    it("should testing handleGetRoot", async () => {
        const mockRequest = {};
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        const payloadResponse = {
            status: "OK",
            message: "BCR API is up and running!"
        };

        const applicationController = new ApplicationController();

        applicationController.handleGetRoot(mockRequest, mockResponse);

        // Assertion
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(payloadResponse);
    });
});

describe("handleNotFound", () => {
    it("should testing handleNotFound", async() => {
        const mockRequest = {};
        const method = "GET";
        const url = "http:localhost:8000/check"

        const mockResponse = {
            status_code : 404, status : () => {
                return{
                    json:() => {
                        return {
                            error:{
                                name:"Error",
                                message:"Not found!",
                                details:{
                                    method,
                                    url,
                                }
                            }
                        }
                    }
                }
            }
        }

        const err = new NotFoundError(method, url)
        const applicationController = new ApplicationController();
        applicationController.handleNotFound(mockRequest, mockResponse);

        //Assertion
        expect (mockResponse.status_code).toEqual(404);
        expect (mockResponse.status().json()).toEqual({error:{
            name:err.name,
            message:err.message,
            details:err.details,
        }})
    })
})

describe("handleError", () => {
    it("should testing handleError", async () => {
        const mockRequest = {};
        const mockNext = {};
        const mockResponseHandleError = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        const err = new Error("Error!");

        const applicationController = new ApplicationController();

        applicationController.handleError(err, mockRequest, mockResponseHandleError, mockNext);

        // Assertion
        expect(mockResponseHandleError.status).toHaveBeenCalledWith(500);
        expect(mockResponseHandleError.json).toHaveBeenCalledWith({
            error: {
                name: err.name,
                message: err.message,
                details: err.details || null,
            }
        });
    });
});

describe("getOffsetFromRequest", () => {
    it("should testing getOffsetFromRequest", async () => {

        const query = {page : 1, pageSize : 10};
        const mockRequest = {
            query
        };
        
        const offset = (query.page - 1) * query.pageSize;

        const applicationController = new ApplicationController()
        const result = await applicationController.getOffsetFromRequest(mockRequest)

        expect(result).toBe(offset)
    });
});

describe("buildPaginationObject", () => {
    it("should testing buildPaginationObject", async () => {

        const query = {
            page : 1, 
            pageSize : 10
        };
        const count = 0;

        const mockRequest = {
            query
        };

        const pageCount = Math.ceil(count / query.pageSize);

        const result = [{
            page:query.page,
            pageCount,
            pageSize:query.pageSize,
            count
        }];
        
        const applicationController = new ApplicationController()
        const returnVal = applicationController.buildPaginationObject(
            mockRequest, 
            count)

        expect(returnVal).toStrictEqual(result[0])
    });
});