import React from "react";
import { useForm } from "react-hook-form";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm();




  const newPasswordValue = watch("newPassword");

  const {mutate:changeUserPassword}=useMutation({
      mutationFn:async({oldPassword,newPassword})=>
      {
        const res=await axios.patch(`http://localhost:8000/api/v1/users/change-password`,{oldPassword,newPassword},{withCredentials:true});
        return res.data;
      },
      onSuccess:()=>
      {
            reset();
      }
  })

  const onSubmit =  (data) => {
    console.log("Form data:", data);
    changeUserPassword(data);

    console.log("muatte value is::",changeUserPassword)

  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-gray-800 text-white">
      <h2 className="text-2xl font-bold text-center mb-6">
        Change Password
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label className="block mb-1 font-medium">Old Password</label>
          <input
            type="password"
            {...register("oldPassword", { required: "Old password is required" })}
            className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="Enter old password"
          />
          {errors.oldPassword && (
            <p className="text-red-400 text-sm mt-1">
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">New Password</label>
          <input
            type="password"
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              validate: {
                hasUpper: (v) =>
                  /[A-Z]/.test(v) || "Must contain at least one uppercase letter",
                hasLower: (v) =>
                  /[a-z]/.test(v) || "Must contain at least one lowercase letter",
                hasNumber: (v) =>
                  /\d/.test(v) || "Must contain at least one number",
                hasSpecial: (v) =>
                  /[!@#$%^&*]/.test(v) ||
                  "Must contain at least one special character (!@#$%^&*)",
              },
            })}
            className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="Enter new password"
          />
          {errors.newPassword && (
            <p className="text-red-400 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Confirm New Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPasswordValue || "Passwords do not match",
            })}
            className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="Confirm new password"
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 transition font-semibold py-2 mt-2 rounded-lg"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
