import {createCar} from "../api/garageApi.ts";

export const generateCarsCreate = () => {
    const cars = ['Mersedes', 'Audi', 'BMW', 'KIA', 'Hyundai', 'Peugeot', 'Renault', 'Citroen', 'Volkswagen', 'Porsche', 'Ferrari',
        'BYD', 'Tesla', 'Opel', 'Dodge', 'Chevrolet', 'JMC', 'Land rover', 'Range rover', 'Lada', 'Mitsubishi', 'Toyota', 'Mazda',
        'Dongfeng', 'JAC', 'Moskvich', 'Zhiguli', 'Geely', 'Volga', 'Honda', 'Ford'
    ];
    for (let i = 0; i < 100; i++) {
        const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        const name = cars[Math.floor(Math.random() * cars.length)];

        createCar(name, color);
    }
}