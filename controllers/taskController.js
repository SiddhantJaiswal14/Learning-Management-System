const express = require("express");

// include the model class

const { Task } = require("../models/User");

const router = express.Router();

router.get("/task", (req, res) => {
  res.render("task/addorEdit.hbs", {
    viewTitle: "Create Task",
  });
});

//handling post request
router.post("/task", (req, res) => {
  // check if this post is for creation of record or the updation

  if (req.body._id == "") {
    insertRecord(req, res);
  } else {
    updateRecord(req, res);
  }
});

function insertRecord(req, res) {
  var task = new Task();
  task.description = req.body.description;
  task.completed = req.body.completed;
  task.deadline = req.body.deadline;

  //check for validation
  if (task.description == "" || task.completed == "" || task.deadline == "") {
    res.render("task/addOrEdit.hbs", {
      viewTitle: "Create Task",
      error: "Please enter all details",
      task: req.body,
    });
    return;
  }

  task.save((err, doc) => {
    //if no error
    if (!err) {
      res.redirect("task/list");
    } else {
      // if err is there
      console.log("An error is there in insertion of record" + err);
    }
  });
}

//route for displaying users

router.get("/task/list", (req, res) => {
  Task.find({})
    .lean()
    .exec((err, docs) => {
      if (!err) {
        res.render("task/list.hbs", {
          list: docs,
        });
      }
    });
});

router.get("/task/:id", (req, res) => {
  Task.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("task/addOrEdit.hbs", {
        viewTitle: "Update Task",
        task: doc,
      });
    }
  });
});

router.get("/task/delete/:id", (req, res) => {
  Task.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/task/list");
    } else {
      console.log("Error occured during deletion" + err);
    }
  });
});

function updateRecord(req, res) {
  Task.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      // if no error
      if (!err) {
        res.redirect("task/list");
      } else {
        // if any err
        console.log("Error occured in updating record" + err);
      }
    }
  );
}

module.exports = router;
