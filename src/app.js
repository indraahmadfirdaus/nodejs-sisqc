const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
const { port, beUrl } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');
const goodsRoutes = require('./routes/goodsRoutes');
const qcReportRoutes = require('./routes/qcReportRoutes');
const incidentRoutes = require('./routes/incidentRoutes');


const morgan = require('morgan')
const env = require('./config/env');

const app = express();

connectDB();

app.use(morgan('dev'))

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Health Check, current time: ' + new Date().toLocaleString());
});

const getSwaggerServerUrl = () => {
    return env.swaggerServerUrl;
};

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SISQC API',
            version: '1.0.0',
            description: 'API documentation for QC Monitoring System'
        },
        servers: [
            {
                url: getSwaggerServerUrl(),
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/users', userRoutes);
app.use('/api/goods', goodsRoutes);
app.use('/api/qc-reports', qcReportRoutes);
app.use('/api/incidents', incidentRoutes);

app.use(errorHandler);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Swagger documentation available at ${getSwaggerServerUrl()}/docs`);
});