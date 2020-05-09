import * as React from 'react';
import { IDelivery } from '../common/types';
import Api from '../common/api';
import Delivery from '../components/Delivery';

const ItemReturn = () => {
  const [userCode, setUserCode] = React.useState('');
  const [currentDelivery, setCurrentDelivery] = React.useState<IDelivery | null>(null);

  const [isFetching, setIsFetching] = React.useState(false);

  const [isSuccessfullyProcessed, setIsSuccessfullyProcessed] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const getCurrentDelivery = () => {
    setIsFetching(true);
    setError(null);

    Api.getDelivery(userCode)
      .then(delivery => setCurrentDelivery(delivery))
      .catch(err => setError(err.message))
      .finally(() => { setIsFetching(false); });
  };

  const processCurrentDelivery = (itemIds: number[]) => {
    setIsFetching(true);

    Api.postReturn(currentDelivery!.id, itemIds)
      .then((returnedDelivery) => {
        setIsFetching(false);
        setIsSuccessfullyProcessed(true);
        console.log('Возврат произведен', returnedDelivery);
        setTimeout(() => {
          setIsSuccessfullyProcessed(false);
          setUserCode('');
          setCurrentDelivery(null);
        }, 3000);
      });
  };

  return (
    <div className="page">
      <h2>Возврат товара</h2>

      <div className="item-issue-form">
        <input
          disabled={isFetching}
          type="text"
          value={userCode}
          onChange={e => setUserCode(e.currentTarget.value)}
        />
        <button
          disabled={isFetching}
          type="button"
          onClick={getCurrentDelivery}
        >
          Запросить
        </button>
      </div>

      {error ? <span className="error">{error}</span> : ''}

      {isFetching ? 'Загрузка...' : ''}

      {
        currentDelivery
          ? (
            <Delivery
              delivery={currentDelivery}
              onDeliveryReceived={processCurrentDelivery}
            />
          ) : ''
      }
      {
        isSuccessfullyProcessed
          ? <h3>Отлично, спасибо!</h3>
          : ''
      }
    </div>
  );
};


export default ItemReturn;
