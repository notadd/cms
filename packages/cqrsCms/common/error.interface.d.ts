import { HttpStatus } from "@nestjs/common";
export interface ErrorInterface {
    readonly type: string;
    readonly httpStatus: HttpStatus;
    readonly errorMessage: string;
    readonly userMessage: string;
}
export interface ResizeData {
    scale?: number;
    wscale?: number;
    hscale?: number;
    width?: number;
    height?: number;
    pixel?: number;
}
export interface Resize {
    mode: string;
    data: ResizeData;
}
export interface Tailor {
    isBefore: boolean;
    width: number;
    height: number;
    x: number;
    y: number;
    gravity: string;
}
export declare class ImagePreProcessInfo {
    resize?: Resize;
    tailor?: Tailor;
    watermark?: boolean;
    rotate?: number;
}
