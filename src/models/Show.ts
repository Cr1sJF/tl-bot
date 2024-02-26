import { IShowData } from "../types";
import Media from "./Media";

export default class Show extends Media implements IShowData{
    years: string;
    chapters: number;
    seasons: number;
    status: string;

    constructor(data: IShowData) {
        super(data);

        this.years = data.years;
        this.chapters = data.chapters;
        this.seasons = data.seasons;
        this.status = data.status;

    }
}