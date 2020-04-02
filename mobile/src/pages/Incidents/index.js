import React, { useState, useEffect } from 'react';
import {View, FlatList, Image, Text, TouchableOpacity} from 'react-native';
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import 'intl';

import api from '../../services/api'

import logoImg from '../../../assets/logo.png';
import styles from './styles'

export default function Incidents() {

    const navigation = useNavigation();
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    function navigateToDetail(incident) {
        navigation.navigate('Detail', { incident })
    }

    async function loadItens(){
        if (loading) {
            return;
        }

        if ( total > 0 && incidents.length === total) {
            return;
        }

        setLoading(true);

        const res = await api.get('incidents')

        setIncidents([...incidents, ...res.data]);
        setTotal(res.headers['x-total-count']);
        setPage(page + 1);
        setLoading(false);
    }

    useEffect(() => {
        loadItens();
    }, []);


    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg} />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}> {total} Casos </Text>
                </Text>
            </View>

            <Text style={styles.title} > Bem Vindo!</Text>
            <Text style={styles.description} > Escolha abixo um caso e salve o dia de alguém.</Text>

            <FlatList 
                style={styles.incidentList}
                data={incidents}
                keyExtractor ={incident => String(incident.id)}
                showsVerticalScrollIndicator={false}
                onEndReached={loadItens}
                onEndReachedThreshold={0.2}
                renderItem={({ item:incident }) => (
                    <View style={styles.incidentItem}>
                        <Text style={styles.incidentProperty}> Ong: </Text>
                        <Text style={styles.incidentValue}>{incident.name}</Text>

                        <Text style={styles.incidentProperty}> Caso:</Text>
                        <Text style={styles.incidentValue}>{incident.tittle}</Text>

                        <Text style={styles.incidentProperty}> Valor: </Text>
                        <Text style={styles.incidentValue}>{Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL'}).format(incident.value)} </Text>

                        <TouchableOpacity style={styles.detailsButton} onPress={() => navigateToDetail(incident)} >
                            <Text style={styles.detailButtonText}> Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={17} color='#e02041'/>
                        </TouchableOpacity>

                    </View>
                )}
            />   
        </View>
    );
}