const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    sectionName:{
        type: String,
        required: true
    },
    subSection:[{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subsection'
    }]
    

});

const Section = mongoose.model('Section',"sectionSchema");

module.exports = Section;