const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const DataSchema = new Schema({
    type: {
        type: String,
        index: true,
        trim: true,
    },
    value: {
        type: Number,
        trim: true,
    },
    _dataCreatedAt   : {
        type: Date,
        default: Date.now
    },
})

const WidgetSchema = new Schema({
    _id         : { 
        type: String, 
        trim: true,
        unique: true,
        required: true
    },
    widgetTitle: {
        type: String,
        trim: true,
    },
    resourceType: {
        type: String,
        trim: true,
    },
    resourceId: {
        type: String,
        index: true,
        trim: true,
    },
    widgetChart: {
        type: String,
        trim: true,
    },
    settings: {
        triggerMax: {
            value: {
                type: String,
                trim: true,
            },
            notif: {
                type: String,
                trim: true,
            },
            mail: {
                type: String,
                trim: true,
            },
            mailList: {
                type: String,
                trim: true,
            },
            actionOn: [],
            actionOff: [],
        },
        triggerMin: {
            value: {
                type: String,
                trim: true,
            },
            notif: {
                type: String,
                trim: true,
            },
            mail: {
                type: String,
                trim: true,
            },
            mailList: {
                type: String,
                trim: true,
            },
            actionOn: [],
            actionOff: [],
        }
    },
    data: [DataSchema]
})

const graphDataSchema = new Schema({
    _id         : { 
        type: String, 
        trim: true,
        required: true 
    }, 
    userId      : { 
        type: String, 
        trim: true,
        index: true,
        required: true 
    },
    graph      : { 
        type: String, 
        trim: true,
        required: true 
    }, 
    desc        : { 
        type: String, 
        trim: true,
        required: true 
    },
    share       : {
        type: Number, 
        trim: true,
        required: true 
    },
    graph_default : {
        type: Number, 
        trim: true
    },
    layouts : {},
    graph_widget    : [WidgetSchema]
}, { timestamps: true });

const GraphData = mongoose.model('graph_data', graphDataSchema);

module.exports = GraphData;