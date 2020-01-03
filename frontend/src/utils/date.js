import * as moment from 'moment';

const formatDate = x => (x ? moment(x).format('DD.MM.YYYY') : 'Brak');

export { formatDate };
