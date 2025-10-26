import express from "express";
import employees from "#db/employees";

const router = express.Router();
export default router;

/** Checks if the request body contains the required fields */
function requireBody(fields) {
  return (req, res, next) => {
    if (!req.body) return res.status(400).send("Request body is required.");

    const missing = fields.filter((field) => !(field in req.body));
    if (missing.length > 0)
      return res.status(400).send(`Missing fields: ${missing.join(", ")}`);

    next();
  };
}

router.get("/", (req, res) => {
  res.send(employees);
});

router.post("/", requireBody(["name"]), (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Name is required");
  const newEmployee = { id: employees.length + 1, name: name};

  employees.push(newEmployee);

  res.status(201).send(newEmployee);
})

// Note: this middleware has to come first! Otherwise, Express will treat
// "random" as the argument to the `id` parameter of /employees/:id.
router.get("/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * employees.length);
  res.send(employees[randomIndex]);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  // req.params are always strings, so we need to convert `id` into a number
  // before we can use it to find the employee
  const employee = employees.find((e) => e.id === +id);

  if (!employee) {
    return res.status(404).send("Employee not found");
  }

  res.send(employee);
});
