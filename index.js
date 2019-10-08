'use strict';

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';


const ComputerDataStorage = require('./dataStorage');
const dataStorage = new ComputerDataStorage();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pageviews'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'menu.html'))
});

app.get('/all', (req, res) => {
    dataStorage.getAll()
    .then(
        result => res.render('allComputers', {result})
    )
    .catch(
        err => console.log(err.message)
    )
});

app.get('/getcomputer', (req, res) => {
    res.render('getComputer', {title: 'Get', header: 'Get', action: '/getcomputer'})
});

app.get('/inputform', (req, res) => {
    res.render('form', {
        header: 'Add a new computer',
        action: '/insert',
        id: {
            value: '',
            readonly: ''
        },
        name: {
            value: '',
            readonly: ''
        },
        type: {
            value: '',
            readonly: ''
        },
        amount: {
            value: '',
            readonly: ''
        },
        price: {
            value: '',
            readonly: ''
        }
    });
});

app.get('/deletecomputer', (req, res) => {
    res.render('getComputer', {title: 'Remove', header: 'Remove', action: '/deletecomputer'})
});

app.post('/deletecomputer', (req, res) => {
    if (!req.body) {
        res.sendErrorPage(res, 'Not found');
    } 
    dataStorage.delete(req.body.id)
        .then(message => sendStatusPage(res, message))
        .catch(error => sendErroePage(res, error.message))
})

app.post('/getcomputer', (req, res) => {
    if (!req.body) {
        res.sendErrorPage(res, 'Not found');
    } 
    const id = req.body.id;
    console.log(id)
    dataStorage.getComputer(id)
        .then(computer  => res.render('computerPage', {result: computer}))
        .catch(error => sendErrorPage(res, error.message))

});

app.post('/insert', (req, res) => {
    if(!req.body) sendErrorPage(res, 'Not found');
    console.log(req.body)
    dataStorage.insert(req.body)
        .then(message => sendStatusPage(res, message))
        .catch(error => sendErrorPage(res, error))
});

app.post('/updatedata', async (req, res) => {
    const id = req.body.id;
    try {
        const computer = await dataStorage.getComputer(id);
        res.render('form', {
            header: 'Update data',
            action: '/updatecomputer',
            id: {
                value: computer.id,
                readonly: 'readonly'
            },
            name: {
                value: computer.name,
                readonly: ''
            },
            type: {
                value: computer.type,
                readonly: ''
            },
            amount: {
                value: computer.amount,
                readonly: ''
            },
            price: {
                value: computer.price,
                readonly: ''
            }
        })
    } catch (err) {
        sendErrorPage(res, err.message)
    }
});

app.post('/updatecomputer', (req, res) => {
    if (!req.body) sendErrorPage(res, 'Not found');
    
    dataStorage.update(req.body)
        .then(message => sendStatusPage(res, message))
        .catch(error => sendErrorPage(res, error.message))
})

app.get('/updateform', (req, res) => {
    res.render('form', {
        header: 'Update data',
        action: '/updatedata',
        id: {
            value: '',
            readonly: ''
        },
        name: {
            value: '',
            readonly: 'readonly'
        },
        type: {
            value: '',
            readonly: 'readonly'
        },
        amount: {
            value: '',
            readonly: 'readonly'
        },
        price: {
            value: '',
            readonly: 'readonly'
        }
    });
})



function sendErrorPage(res, message) {
    res.render('statusPage', {title: 'Error', header: 'Error', message: message})
}


function sendStatusPage(res, message) {
    res.render('statusPage', {title: 'Status', header: 'Status', message: message})
}

app.listen(port, host, () => console.log(`Server ${host} is listerning on port ${port}`))