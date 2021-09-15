import { NextFunction, Request, Response } from "express";

/**
 * Parse pagination query params
 * @example
 *  @Response() res => res.locals.paginate
 * @param req 
 * @param res 
 * @param next 
 */

export function PaginationMiddleware (req: Request, res: Response, next: NextFunction) {
    let page = parseInt((req.query.page || '1').toString()) || 1
    let limit = parseInt((req.query.limit || '10').toString()) || 10

    if(limit > 50) limit = 50

    res.locals.paginate = {
        take: limit,
        skip: (page === 1) ? 0: page * limit - limit
    }

    next()
}

// let {take, skip} = res.locals.paginate