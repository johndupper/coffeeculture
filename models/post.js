var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
        user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title:         { type: String,  required: true },
        content:       { type: String, required: true },
        website:       { type: String }
    },
    { timestamps: true }
);

function date2String(date) {
    var options = {
        weekday: 'short', year: '2-digit', month: 'short',
        day: 'numeric', hour: '2-digit', minute: '2-digit'
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