import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

let { Schema } = mongoose;

let userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    bio:{
        type: String,
        trim: true,
    },
    pfpurl:{
        type: String,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        select:false,
        minlength: [6, "Password is too short"],
    },
} , {
    timestamps: true,
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')){ //--> If password isn't modified then next()
        return next();
    }

    // If password is modified then encrypt password in 10 rounds/salt
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

// Token Generating method
userSchema.methods = {
    jwtToken() {
        return JWT.sign(
            // First part
            {id: this._id,
            email: this.email},
            process.env.SECRET,
            { expiresIn: '24h' }

        )
    }
}

let userModel = mongoose.model('users', userSchema);
export default userModel;