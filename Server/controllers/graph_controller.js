const graphModel    = require('../models/mongoDB/graph_model')
const uuid          = require('shortid')

exports.index = async (req, res) => {
    try {
        graphModel.find({ userId: req.id_user }).then((data) => {
            res.status(200).json(data)
        }).catch((err) => {
            res.status(500).json({ status: "Error", code: "500", msg: "Internal Server Error"})
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
};

exports.create = async (req, res) => {
    try {
        const id        = uuid.generate()
        const graph     = req.body.graph_name ? req.body.graph_name : null
        const desc      = req.body.desc ? req.body.desc : null
        
        if(graph === null || desc === null) {
            res.status(400).json({ 
                Error: 'BAD REQUEST', 
                Code: 400, 
                msg: 'Please fill all required fields!',
                BODY_DATA_REQUIRED:  {
                    graph_name: {
                        type: 'String',
                        require: true
                    },
                    desc: {
                        type: 'LongText',
                        require: true
                    }
                }
            })
        } else {
            const dataBody  = { 
                _id             : id,
                userId          : req.id_user,
                graph           : graph, 
                desc            : desc,
                share           : 0,
                graph_default   : 0
            }

            graphModel.create(dataBody)
                .then(data => {
                    res.status(200).json({ status: 'Success', code: 200, 'msg': 'Success saving data graph!', data: data})
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ status: 'Failed', code: 400, 'msg' : 'Failed saving data graph!'})
                })   
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}

exports.edit = async (req, res) => {
    const graph     = req.body.graph_name
    const desc      = req.body.desc
    const share     = req.body.share_status

    try {
        const dataBody  = { 
            graph   : graph, 
            desc    : desc,
            share   : share
        }

        graphModel.findByIdAndUpdate({ _id: req.params.id }, 
            { 
                $set: { 
                    ...dataBody
                }
            })
            .then(data => {
                res.status(200).json({ status: 'Success', code: 200, 'msg': 'Success update data graph!', data: data})
            })
            .catch(err => {
                res.status(500).json({ status: 'Failed', code: 400, 'msg' : 'Failed update data graph!'})
                console.log(err)
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}

exports.delete = async (req, res) => {
    try {
        graphModel.deleteMany({ _id: req.body.id })
        .then(data => {
            res.json(data)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ status: 'Failed', code: 500, 'msg' : 'Failed delete data graph!'})
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: 400, msg:'Internal Server Error'})
    }
}

exports.widget_create = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
        res.status(500).json({status: 'Error', code: '500', msg:'Internal Server Error'})
    }
}
