import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useQuery,useQueryClient,useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';

function PersonalInfo() {

    const userData=useSelector((state)=> state.auth.userData);

  const { register, handleSubmit, formState: { errors },reset } = useForm({
    defaultValues:{
        newFullName:userData?.fullName,
        newEmail:userData?.email,
    }
  });
    // const{newEmail,newFullName}=req.body;

    const queryClient=useQueryClient();

    const {mutate:updateUserInfo}=useMutation({
        mutationFn:async(data)=>
        {
            const res=await axios.patch(`http://localhost:8000/api/v1/users/update-details`,data,{withCredentials:true});
            console.log("updated perosnla info is::",res.data.data);
        }
        
    })
 

  const onSubmit = (data) => {
    console.log("Form values:", data);
    const isUnchanged=userData?.fullName == data.newFullName && userData?.email==data.newEmail;
    if(isChangedUserInfo){
        alert("full name and email unchanged");
        return;
    }  
    updateUserInfo(data);
    reset();
  };

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

        <div className="flex flex-col">
          <Label htmlFor="newFullName" className="mb-1">newFullName</Label>
          <Input
        
            id="newFullName"
            {...register("newFullName", { required: "First name is required" })}
            placeholder="Enter your first name"
          />
          {errors.newFullName && <p className="text-red-500 text-sm mt-1">{errors.newFullName.message}</p>}
        </div>

        {/* <div className="flex flex-col">
          <Label htmlFor="lastName" className="mb-1">Last Name</Label>
          <Input
            id="lastName"
            {...register("lastName", { required: "Last name is required" })}
            placeholder="Enter your last name"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
        </div> */}

        <div className="flex flex-col">
          <Label htmlFor="newEmail" className="mb-1">newEmail</Label>
          <Input
            id="newEmail"
            type="email"
            {...register("newEmail", { required: "Email is required" })}
            placeholder="Enter your email address"
          />
          {errors.newEmail && <p className="text-red-500 text-sm mt-1">{errors.newEmail.message}</p>}
        </div>

        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Save Changes
        </Button>
      </form>
    </div>
  );
}

export default PersonalInfo;
