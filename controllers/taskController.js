const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { Task } = require("../models/User");
const router = express.Router();

// get request for task page
router.get("/addOrEdit", requireAuth, (req, res) => {
  res.render("addOrEdit.hbs", {
    viewTitle: "Create Task",
  });
});

// post request for task page
router.post("/addOrEdit", (req, res) => {
  // check if this post request is for creation of record or the updation of record
  if (req.body._id == "") {
    insertRecord(req, res);
  } else {
    updateRecord(req, res);
  }
});

// creation of task
function insertRecord(req, res) {
  var task = new Task();
  task.description = req.body.description;
  task.completed = req.body.completed;
  task.deadline = req.body.deadline;

  // validation check
  if (task.description == "" || task.completed == "" || task.deadline == "") {
    res.render("addOrEdit.hbs", {
      viewTitle: "Create Task",
      error: "Please enter all details",
      task: req.body,
    });
    return;
  }

  task.save((err, doc) => {
    if (!err) {
      res.redirect("list");
    } else {
      console.log("An error is there in insertion of record" + err);
    }
  });
}

// get request for view task page

router.get("/list", requireAuth, (req, res) => {
  Task.find({})
    .lean()
    .exec((err, docs) => {
      if (!err) {
        res.render("list.hbs", {
          list: docs,
        });
      }
    });
});

//get request for edit task
router.get("/addOrEdit/:id", (req, res) => {
  Task.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("addOrEdit.hbs", {
        viewTitle: "Update Task",
        task: doc,
      });
    }
  });
});

// get request for delete task
router.get("/delete/:id", (req, res) => {
  Task.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/list");
    } else {
      console.log("Error occured during deletion" + err);
    }
  });
});

// updation of task
function updateRecord(req, res) {
  Task.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("list");
      } else {
        console.log("Error occured in updating record" + err);
      }
    }
  );
}

module.exports = router;
