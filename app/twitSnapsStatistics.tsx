// twitSnapsStatistics.tsx
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/authContext';
import { getUsersInteractions, getSnapsByUsername } from '@/handlers/postHandler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { getProfile } from '@/handlers/profileHandler';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SnapInteraction {
  id: string;
  likes: number;
  shares: number;
  time: string;
}

export default function TwitSnapsStatistics() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [interactions, setInteractions] = useState<{ [key: string]: any }>({});
  const [snaps, setSnaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalSnaps, setTotalSnaps] = useState<number>(0);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [totalShares, setTotalShares] = useState<number>(0);
  const [filteredSnaps, setFilteredSnaps] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState<boolean>(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState<boolean>(false);
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (snaps.length > 0) {
      filterSnaps();
    }
  }, [startDate, endDate, selectedDateRange, interactions]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Obtener el perfil del usuario
      const profileResponse = await getProfile();
      if (profileResponse.success) {
        const username = profileResponse.profile.username;

        // Obtener los TwitSnaps del usuario
        const snapsResponse = await getSnapsByUsername(username);
        if (snapsResponse.success && snapsResponse.snaps) {
          setSnaps(snapsResponse.snaps);
          setTotalSnaps(snapsResponse.snaps.length);
        } else {
          setSnaps([]);
          setTotalSnaps(0);
        }

        // Obtener las interacciones de los usuarios
        const interactionsResponse = await getUsersInteractions();
        if (interactionsResponse.success && interactionsResponse.interactions) {
          setInteractions(interactionsResponse.interactions);
        } else {
          setInteractions({});
        }
      } else {
        Alert.alert('Error', 'No se pudo obtener el perfil del usuario.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Ocurrió un error al obtener los datos.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterSnaps = () => {
    // Crear una copia de los TwitSnaps originales
    let filtered = [...snaps];

    // Determinar el rango de fechas
    if (selectedDateRange !== 'all') {
      let start: moment.Moment;
      let end: moment.Moment = moment();

      switch (selectedDateRange) {
        case 'last7days':
          start = moment().subtract(7, 'days');
          break;
        case 'lastMonth':
          start = moment().subtract(1, 'month');
          break;
        case 'lastYear':
          start = moment().subtract(1, 'year');
          break;
        case 'custom':
          if (startDate && endDate) {
            start = moment(startDate);
            end = moment(endDate);
          } else {
            Alert.alert('Selecciona las fechas de inicio y fin para el filtro personalizado.');
            return;
          }
          break;
        default:
          start = moment(0);
      }

      // Filtrar los TwitSnaps dentro del rango de fechas
      filtered = filtered.filter((snap) => {
        const snapTime = moment(snap.time);
        return snapTime.isBetween(start, end, undefined, '[]');
      });
    }

    // Calcular totales
    let likes = 0;
      let shares = 0;

      filtered.forEach((snap) => {
        // Asegúrate de obtener las interacciones correctamente
        const snapInteractions = interactions[snap._id] || {};

        // Logs para depuración
        console.log('Snap ID:', snap._id);
        console.log('Snap Interactions:', snapInteractions);

        // Calcula los likes y shares
        if (Array.isArray(snapInteractions.likes)) {
          likes += snapInteractions.likes.length;
        }
        if (Array.isArray(snapInteractions.retweets)) {
          shares += snapInteractions.retweets.length;
        }
      });

      // Actualizar estado con los datos filtrados
      setTotalLikes(likes);
      setTotalShares(shares);
      setFilteredSnaps(filtered);

      // Log para confirmar el resultado
      console.log('Filtered Snaps:', filtered);
      console.log('Total Likes:', likes);
      console.log('Total Shares:', shares);
    };

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleConfirmStartDate = (date: Date) => {
    setStartDate(date);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleConfirmEndDate = (date: Date) => {
    setEndDate(date);
    hideEndDatePicker();
  };

  const predefinedRanges = [
    { label: 'Todos', value: 'all' },
    { label: 'Últimos 7 días', value: 'last7days' },
    { label: 'Último mes', value: 'lastMonth' },
    { label: 'Último año', value: 'lastYear' },
    { label: 'Personalizado', value: 'custom' },
  ];

  const handleDateRangeChange = (value: string) => {
    setSelectedDateRange(value);
    if (value !== 'custom') {
      setStartDate(null);
      setEndDate(null);
    }
  };

  // Función para manejar el botón de volver
  const handleBackPress = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado con botón de volver */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#1DA1F2" />
        </TouchableOpacity>
        <Text style={styles.title}>Estadísticas de TwitSnaps</Text>
      </View>

      {/* Filtros de fecha */}
      <View style={styles.filterContainer}>
        {predefinedRanges.map((range) => (
          <TouchableOpacity
            key={range.value}
            style={[
              styles.filterButton,
              selectedDateRange === range.value && styles.filterButtonSelected,
            ]}
            onPress={() => handleDateRangeChange(range.value)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedDateRange === range.value && styles.filterButtonTextSelected,
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedDateRange === 'custom' && (
        <View style={styles.customDatePickerContainer}>
          <TouchableOpacity onPress={showStartDatePicker} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>
              {startDate ? moment(startDate).format('DD/MM/YYYY') : 'Fecha Inicio'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmStartDate}
            onCancel={hideStartDatePicker}
          />

          <TouchableOpacity onPress={showEndDatePicker} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>
              {endDate ? moment(endDate).format('DD/MM/YYYY') : 'Fecha Fin'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmEndDate}
            onCancel={hideEndDatePicker}
          />
        </View>
      )}

      {/* Panel de estadísticas */}
      <View style={styles.statisticsPanel}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{filteredSnaps.length}</Text>
          <Text style={styles.statLabel}>TwitSnaps publicados</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalLikes}</Text>
          <Text style={styles.statLabel}>Me gusta recibidos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalShares}</Text>
          <Text style={styles.statLabel}>Veces compartido</Text>
        </View>
      </View>

      {/* Lista de TwitSnaps con estadísticas individuales */}
      <Text style={styles.subtitle}>Estadísticas por TwitSnap</Text>
      <FlatList
        data={filteredSnaps}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const snapInteractions = interactions[item._id] || {};

          // Asegurarnos de que item.message es un string
          let messageText = '';
          if (typeof item.message === 'string') {
            messageText = item.message;
          } else if (typeof item.message === 'object' && item.message.text) {
            messageText = item.message.text;
          } else {
            messageText = JSON.stringify(item.message);
          }

          // Agregar console.log para inspeccionar snapInteractions
          console.log('snapInteractions:', snapInteractions);

          const likesCount = Array.isArray(snapInteractions.likes) ? snapInteractions.likes.length : 0;
          const retweetsCount = Array.isArray(snapInteractions.retweets) ? snapInteractions.retweets.length : 0;

          return (
            <View style={styles.snapItem}>
              <Text style={styles.snapMessage}>{messageText}</Text>
              <Text style={styles.snapDate}>{moment(item.time).format('DD/MM/YYYY')}</Text>
              <View style={styles.snapStats}>
                <Text style={styles.snapStat}>
                  Me gusta: {likesCount}
                </Text>
                <Text style={styles.snapStat}>
                  Compartido: {retweetsCount}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Fondo oscuro
    paddingHorizontal: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black', // Fondo oscuro
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginTop: 50,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF', // Texto claro
    marginLeft:30,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    backgroundColor: '#1E1E1E', // Botón oscuro
    borderRadius: 20,
  },
  filterButtonSelected: {
    backgroundColor: '#1DA1F2', // Color de acento
  },
  filterButtonText: {
    color: '#FFFFFF', // Texto claro
    fontSize: 14,
  },
  filterButtonTextSelected: {
    color: '#FFFFFF', // Texto claro
  },
  customDatePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: '#1E1E1E', // Botón oscuro
    marginHorizontal: 10,
    borderRadius: 5,
  },
  datePickerText: {
    fontSize: 14,
    color: '#FFFFFF', // Texto claro
  },
  statisticsPanel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    width: '45%',
    backgroundColor: '#1E1E1E', // Fondo oscuro
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1DA1F2', // Color de acento
  },
  statLabel: {
    fontSize: 14,
    color: '#B0B0B0', // Texto gris claro
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 5,
    color: '#FFFFFF', // Texto claro
  },
  snapItem: {
    backgroundColor: '#1E1E1E', // Fondo oscuro
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  snapMessage: {
    fontSize: 16,
    marginBottom: 5,
    color: '#FFFFFF', // Texto claro
  },
  snapDate: {
    fontSize: 12,
    color: '#B0B0B0', // Texto gris claro
    marginBottom: 5,
  },
  snapStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  snapStat: {
    fontSize: 14,
    color: '#FFFFFF', // Texto claro
  },
});