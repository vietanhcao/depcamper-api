const express = require('express');
const { getCourses, updateCourses, getCourse, addCourse, deleteCourse } = require('../controllers/courses');

const router = express.Router({mergeParams: true});

router.route('/').get(getCourses).post(addCourse);

router.route('/:id').get(getCourse).put(updateCourses).delete(deleteCourse)

module.exports = router;
