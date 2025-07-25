import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import UserComponent from "./UserComponent";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

function Form() {
  const [show, setShow] = useState(false);

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
        confirm_password: "",
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        console.log("Form submitted:", values);
        alert("Form submitted successfully!");
      },
    });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <button
        className="py-2 mx-auto px-4 border-2 rounded-lg bg-gray-600 text-white"
        onClick={() => setShow(!show)}
      >
        {show ? "Hide Context Example" : "Show Context Example"}
      </button>
      {show ? <UserComponent /> : null}

      {show ? null : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center w-full sm:w-[80%] md:w-[50%] lg:w-[40%] xl:w-[40%] mx-auto py-10 rounded-2xl bg-white px-8 shadow-lg"
        >
          <h1 className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-10">
            Form Handling using Formik + Yup
          </h1>
          {/* Name */}
          <div className="group flex flex-col border-2 px-2 py-2 w-full rounded-lg mt-4">
            <label
              htmlFor="name"
              className="text-gray-500 group-focus-within:text-black"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter Name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="outline-none"
            />
            {touched.name && errors.name && (
              <span className="text-sm text-red-500">{errors.name}</span>
            )}
          </div>

          {/* Email */}
          <div className="group flex flex-col border-2 px-2 py-2 w-full rounded-lg mt-4">
            <label
              htmlFor="email"
              className="text-gray-500 group-focus-within:text-black"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="outline-none"
            />
            {touched.email && errors.email && (
              <span className="text-sm text-red-500">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="group flex flex-col border-2 px-2 py-2 w-full rounded-lg mt-4">
            <label
              htmlFor="password"
              className="text-gray-500 group-focus-within:text-black"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="outline-none"
            />
            {touched.password && errors.password && (
              <span className="text-sm text-red-500">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="group flex flex-col border-2 px-2 py-2 w-full rounded-lg mt-4">
            <label
              htmlFor="confirm_password"
              className="text-gray-500 group-focus-within:text-black"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              placeholder="Enter Confirm Password"
              value={values.confirm_password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="outline-none"
            />
            {touched.confirm_password && errors.confirm_password && (
              <span className="text-sm text-red-500">
                {errors.confirm_password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 py-2 px-4 rounded-md bg-blue-500 w-full text-white hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default Form;
