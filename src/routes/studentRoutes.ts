import { Router, type Request, type Response } from "express";
import { zStudentId } from "../schemas/studentValidator.js";
import { courses, students } from "../db/db.js";
const router = Router();

router.get("/students/:studentId/courses", (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const result = zStudentId.safeParse(studentId);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }
    const foundstudent = students.findIndex(
      (student) => student.studentId === studentId
    );

    if (foundstudent === -1) {
      return res.status(404).json({
        success: false,
        message: "Student does not exists",
      });
    }

    const course = courses.filter((course) =>
      students[foundstudent]?.courses?.includes(course.courseId)
    );
    res.set("Link", `/students/${studentId}`);

    return res.status(200).json({
      success: true,
      message: `Get courses detail of student ${studentId}`,
      data: {
        studentId: studentId,
        courses: course,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: error,
    });
  }
});

export default router;
