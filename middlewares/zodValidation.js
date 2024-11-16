const z = require("zod");



const signupSchema = z.object({
  username: z.string(),
  password: z.string(),
  fName: z.string(),
  lName: z.string(),
});

const updateSchema=z.object({
  username:z.string().optional(),
  fName:z.string().optional(),
  lName:z.string().optional()
})


function Signupvalidation(req,res,next){
    const body = req.body;
    console.log(body)
    const parseResult = signupSchema.safeParse(body);
  
    if (!parseResult.success) {
      console.log(parseResult.error.issues)
      return res.status(411).json({
        msg: "incorrect inputs",
        errors: parseResult.error.issues
      });
    }

    next();
}

function updateValid(req,res,next){
  const parseResult=updateSchema.safeParse(req.body);
  if(!parseResult.success){
    return res.status(411).json({
      msg:"error while updating"
    })
  }
  next();
}

module.exports={Signupvalidation,updateValid}