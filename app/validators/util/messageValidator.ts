import Student from "../../modules/student";
import Teacher from "../../modules/teacher";
import Profession from "../../modules/profession";
import { OAuthException } from "../../../core/http-exception";

const GetGradeMessage = async () => {
    const grades = await Student.findAll({
        attributes: ["grade"],
        group: ["grade"],
    });

    const result = [];
    for (let g of grades) {
        result.push(g.grade);
    };

    return result;
};

const GetProfessionMessage = async () => {
    const professions = await Profession.findAll({
        attributes: ["id", "name"],
    });

    return professions;
};

const GetTeacherMessage = async () => {
    const teachers = await Teacher.findAll({
        attributes: ["id", "name"],
    });

    return teachers;
};

export {
    GetGradeMessage,
    GetProfessionMessage,
    GetTeacherMessage,
};