import mongoose from 'mongoose';

const thresholdSchema = new mongoose.Schema({
    city: { type: String, required: true },
    tempThreshold: { type: Number, required: true },
    consecutiveLimit: { type: Number, default: 2 },
    consecutiveBreaches: { type: Number, default: 0 },
    emailAlert: { type: Boolean, default: false },
    recipient: { type: String },  // Email recipient
});

const Threshold = mongoose.model('Threshold', thresholdSchema);

export default Threshold;
