import React, { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';

const BusArrivalInfo = () => {
    const [busInfo, setBusInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [textColor, setTextColor] = useState('black');

    useEffect(() => {
        const fetchBusData = async () => {
            try {
                const response = await axios.get('https://api.gbis.go.kr/ws/rest/busarrivalservice/tv', {
                    params: {
                        serviceKey: '1234567890', // 여기에 실제 API 키를 입력하세요
                        stationId: '200000075',
                        routeId: '233000031',
                    },
                    responseType: 'text'
                });

                const result = await xml2js.parseStringPromise(response.data, { mergeAttrs: true });
                setBusInfo(result.response.msgBody[0].busArrivalItem[0]);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchBusData();

        // 3초마다 데이터 갱신
        const intervalId = setInterval(fetchBusData, 3000);

        // 1초마다 현재 시간 갱신
        const timeIntervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // 언마운트 시 인터벌 정리
        return () => {
            clearInterval(intervalId);
            clearInterval(timeIntervalId);
        };
    }, []);

    useEffect(() => {
        // 버스 위치에 따라 색상 변경
        const location = busInfo && busInfo.stationNm1;
        if (location) {
            if (location.includes('삼익아파트') || location.includes('한국가스안전공사')) {
                setTextColor('blue');
            } else {
                setTextColor('black');
            }
        }
    }, [busInfo]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>오류 발생: {error.message}</div>;
    }

    const location = busInfo.stationNm1;
    let busIcon = '';

    if (location.includes('삼익아파트')) {
        busIcon = '🚌';
    } else if (location.includes('한국가스안전공사')) {
        busIcon = '🚌🚌';
    }

    return (
        <div className="center">
            <h3>🚌 경기도 인재 개발원 🚌</h3>
            <div
                style={{
                    color: textColor,
                    padding: 10
                }}
            >
                <strong>현재 시간:</strong> {currentTime.toLocaleTimeString()}<br />
                <strong>버스 위치:</strong> {location} {busIcon}
            </div>
            <div><strong>좌석 수:</strong> {busInfo.remainSeatCnt1}</div>
        </div>
    );
};

export default BusArrivalInfo;
