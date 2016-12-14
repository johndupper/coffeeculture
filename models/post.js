var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
        user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name:         { type: String,  required: true },
        completed:     { type: Boolean, required: true }
    },
    { timestamps: true }  // createdAt, updatedAt
);

function date2String(date) {
    var options = {
        weekday: 'long', year: 'numeric', month: 'short',
        day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

PostSchema.methods.getCreatedAt = function() {
    return date2String(this.createdAt);
};

PostSchema.methods.getUpdatedAt = function() {
    return date2String(this.updatedAt);
};

module.exports = mongoose.model('Post', PostSchema);