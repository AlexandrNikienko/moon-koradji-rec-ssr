import { Paragraph } from "./paragraph.model";

export interface Style {
  styleRoute: string;
  styleName: string;
  styleDescription: string;
  styleAbout: Paragraph[];
  relatedStyles: string[];
}