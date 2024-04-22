import axios from 'axios';
import { toast } from 'react-toastify';


export const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return String(error)
}

export const hasPermission = (userData, permissionName) => {
    if(!userData || !userData.roles) return false;

    for(const role of userData.roles){
        if(role.permissions.some(permission=>permission.name == permissionName)){
            return true
        }
    }
    return false
}

export const getUsers = async () => {
    try {
        const response = await axios.get('/user');
        return response.data; // Zwrócenie danych z serwera
    } catch (error) {
        console.error("Wystąpił błąd podczas pobierania listy użytkowników:", error);
        throw error; // Przekazanie błędu do obsługi w komponencie React
    }
};

export const getUser = async () => {
    try {
        const response = await axios.get(`/user/auth`);
        return response.data; // Zwrócenie danych z serwera
    } catch (error) {
        console.error("Wystąpił błąd podczas pobierania użytkownika:", error);
        throw error; // Przekazanie błędu do obsługi w komponencie React
    }
};

export const getPlayers = async () => {
    try {
        const response = await axios.get('/player');
        return response.data; // Zwrócenie danych z serwera
    } catch (error) {
        console.error("Wystąpił błąd podczas pobierania listy banów:", error);
        throw error; // Przekazanie błędu do obsługi w komponencie React
    }
};


export const getPlayer = async (identifier) => {
    try {
        const response = await axios.get(`/player/${identifier}`);
        return response.data; // Zwrócenie danych z serwera
    } catch (error) {
        console.error("Wystąpił błąd podczas pobierania listy banów:", error);
        throw error; // Przekazanie błędu do obsługi w komponencie React
    }
};


export const banPlayer = async (identifier, time, reasonValue, playerName, timeType) => {
    try {
        const webhook= "https://discord.com/api/webhooks/941274128944615434/PCIzgAiG7Ccyy8kBbq8FzH_yoSu2gaZzl4g8P1Gv6_EJwkBqSpHAVnHxvF94eCuMNUUZ"
        const response = await axios.post(`/ban`, {
            identifierHex: identifier,
            time: time,
            reason: reasonValue,
            playerName: playerName,
            timeType: timeType
        });
        sendLogBanPlayer(response.data.logData, webhook)
        return response.data; // Zwrócenie danych z serwera
    } catch (error) {
        console.error("Wystąpił błąd podczas pobierania listy banów:", error);
        throw error; // Przekazanie błędu do obsługi w komponencie React
    }
}

export const unBanPlayer = async(identifier, userAuthData) => {
    const webhook = "https://discord.com/api/webhooks/1229754372313972826/EW-B3wSMsItJOy6jloinZab5OlX183hbaIXgbv675JCubvs1udDyCzE0xo41JPU5pQ1L";
    if(!identifier)
    {
        console.log("Nie podano argumentu identifier")
        return
    }

    try {
        axios.delete(`/ban/${identifier}`)
        .then(function (response){
            sendLogUnbanPlayer(JSON.stringify(response.data.logData), webhook, identifier, userAuthData)
            return response
        })
        .catch(function (error) {
            return error
        });


    } catch(err){
        toast.error(getErrorMessage(err));
    }
}

export const getBanList = async () => {
    try {
        const response = await axios.get('/ban');
        return response.data; // Zwrócenie danych z serwera
    } catch (error) {
        console.error("Wystąpił błąd podczas pobierania listy banów:", error);
        throw error; // Przekazanie błędu do obsługi w komponencie React
    }
};


export const getHistoryBanList = async () => {
    try {
        const response = await axios.get('/banHistory');
        return response.data; // Zwrócenie danych z serwera
    } catch (error) {
        console.error("Wystąpił błąd podczas pobierania listy banów:", error);
        throw error; // Przekazanie błędu do obsługi w komponencie React
    }
};


export const clearInventory = async (identifier, userAuthData) => {
    try {
        const webhook = "https://discord.com/api/webhooks/1229749542841225266/u4DaO6JRT04VxJq-F5qgfddsZgw0AHRJg58adh4sgPH_O1ktGQWtLSv_qIytCTeotoN8";
        const response = await axios.post(`/inventory`, {
            identifierHex : identifier
        });
        sendToLogClearInventory(JSON.stringify(response.data.logData), webhook, identifier, userAuthData);
        console.log(response.data)
        return response.data; // Zwrócenie danych z serwera
    } catch (error) {
        console.error("Wystąpił błąd podczas czyszczenia inventory", error);
        throw error; // Przekazanie błędu do obsługi w komponencie React
    }
};


export const deletePlayer = async (identifier, userAuthData) => {
    try {
        const webhook = "https://discord.com/api/webhooks/1229570818896302101/LooyJ9QZZEXoL-04L1VPSUXk_Ff67D3K7QmCd1pumHuEmfo0LW4acy2R6HPEgay8Rrx7";
        const response = await axios.get(`/player/deleteCharacter/${identifier}`, {});
        Object.keys(response.data.logData).forEach((key, index) => {
            const value = response.data.logData[key];
            setTimeout(() => {
                sendToLogDeleteCharacter(JSON.stringify(value), webhook, identifier, userAuthData, key);
            }, index * 1000); // Opoźnienie rośnie wraz z indeksem, co oznacza opóźnienie o 1 sekundę na każdy kolejny klucz
        });
        return response.data; // Zwrócenie danych z serwera
    } catch (error) {
        console.error("Wystąpił błąd podczas uswania postaci gracza", error);
        throw error; // Przekazanie błędu do obsługi w komponencie React
    }
};


export const getPlayerVehicles= async (data) =>{
    try {
        const response = await axios.get(`/vehicle/${data.playerData.identifier}`, {});
        console.log(response.data)
        return response.data; // Zwrócenie danych z serwera
    } catch (error) {
        console.error("Wystąpił błąd podczas pobierania listy pojazdów gracza", error);
        throw error; // Przekazanie błędu do obsługi w komponencie React
    }
}

export const deleteVehicle= async (plate, userAuthData) =>{
    try {
        const webhook = "https://discord.com/api/webhooks/1231571674076549131/3JCKNg8A5KN6MT6vdocN-oDTGEmkT9KBW-khfNy-aVhmHNTP6ofdMKgwNxFfd-mrIPkO";
        const response = await axios.get(`/vehicle/delete/${plate}`, {});
        console.log(response.data)
        if (response.data.error){
            return false
        }else{
            sendLogToDeleteVehicle(JSON.stringify(response.data.logData), webhook, plate, userAuthData);
            return response.data;
        }
    } catch (error) {
        console.error("Wystąpił błąd podczas pobierania listy pojazdów gracza", error);
        throw error; // Przekazanie błędu do obsługi w komponencie React
    }
}


export const storeVehicle= async (identifierData, modelData, plateData, isDonatorData, userAuthData) =>{
    try {
        console.log(isDonatorData)
        const webhook = "https://discord.com/api/webhooks/1231985621686288394/WpqcOEK9_tdDpAHW2kV9tjaVH7-ABh9E1b3xmdi_5JcZ5cquNcyFH49MbeYAlkCex_Ly";
        const response = await axios.post(`/vehicle`, {
            identifier: identifierData,
            model: modelData,
            plate: plateData,
            isdonator: isDonatorData
        });
        if (!response.data.type){
            return response.data;
        }else{
            sendLogToStoreVehicle(identifierData, modelData, plateData, isDonatorData, webhook, userAuthData);
            return response.data;
        }
    } catch (error) {
        console.error("Wystąpił błąd podczas dodawania samochodu", error);
        throw error; // Przekazanie błędu do obsługi w komponencie React
    }
}

const sendToLogDeleteCharacter = (logData, webhook, identifer, adminData, tableName) => {
    let embeds = [
        {
          title: `USUNIĘCIE POSTACI O HEXIE: **${identifer}** `,
          color: 5174599,
          footer: {
            text: `TABELA | ${tableName}`,
          },
          description : `\`\`\`${logData}\`\`\``,
          fields: [
            {
              name: "Administrator",
              value: `${adminData.name} | ${adminData.discord_id}`
            },
          ],
        },
      ];
    
    let data = JSON.stringify({ embeds });
    
    var config = {
       method: "POST",
       url: webhook,
       headers: { "Content-Type": "application/json" },
       data: data,
    };
    
    axios(config)
       .then((response) => {
          console.log(response)
          return response;
       })
       .catch((error) => {
         console.error("BLAD TAKI:", error);
         return error;
    });
};


const sendToLogClearInventory = (logData, webhook, identifer, adminData) => {
    let embeds = [
        {
          title: `WYCZYSZCZONO INVENTORY OSOBIE O HEXIE: **${identifer}** `,
          color: 5174599,
          footer: {
            text: ``,
          },
          description : `\`\`\`${logData}\`\`\``,
          fields: [
            {
              name: "Administrator",
              value: `${adminData.name} | ${adminData.discord_id}`
            },
          ],
        },
      ];
    
    let data = JSON.stringify({ embeds });
    
    var config = {
       method: "POST",
       url: webhook,
       headers: { "Content-Type": "application/json" },
       data: data,
    };
    
    axios(config)
       .then((response) => {
          console.log(response)
          return response;
       })
       .catch((error) => {
         console.error("BLAD TAKI:", error);
         return error;
    });
};

const sendLogUnbanPlayer = (logData, webhook, identifer, adminData) => {
    let embeds = [
        {
          title: `ODBANOWOWANO OSOBE O HEXIE: **${identifer}** `,
          color: 5174599,
          footer: {
            text: ``,
          },
          description : `\`\`\`${logData}\`\`\``,
          fields: [
            {
              name: "Administrator",
              value: `${adminData.name} | ${adminData.discord_id}`
            },
          ],
        },
      ];
    
    let data = JSON.stringify({ embeds });
    
    var config = {
       method: "POST",
       url: webhook,
       headers: { "Content-Type": "application/json" },
       data: data,
    };
    
    axios(config)
       .then((response) => {
          console.log(response)
          return response;
       })
       .catch((error) => {
         console.error("BLAD TAKI:", error);
         return error;
    });
};

const sendLogBanPlayer = (logData, webhook) => {
    
    let expirationTimestamp = parseInt(logData.expiration);
    let formattedExpirationDate = "Nieokreślone";
    if (expirationTimestamp == 0){
        formattedExpirationDate = "PERM";
    }else{
        // Utwórz obiekt daty na podstawie timestampu
        let expirationDate = new Date(expirationTimestamp * 1000);
        
        // Pobierz poszczególne elementy daty
        let day = expirationDate.getDate().toString().padStart(2, '0');
        let month = (expirationDate.getMonth() + 1).toString().padStart(2, '0'); // Dodaj 1, ponieważ styczeń to miesiąc 0
        let year = expirationDate.getFullYear();
        let hours = expirationDate.getHours().toString().padStart(2, '0');
        let minutes = expirationDate.getMinutes().toString().padStart(2, '0');
        let seconds = expirationDate.getSeconds().toString().padStart(2, '0');
        
        // Utwórz string z datą w odpowiednim formacie
        formattedExpirationDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    
    const message = `Gracz: ${logData.targetplayername}\nPowód: ${logData.reason}\nDługość: ${formattedExpirationDate}\nNadany przez: ${logData.sourceplayername}\nUnbana zakupić możesz na: https://indrop.eu/s/majorkarp`
    let embeds = [
        {
            title:message,
            type: "rich",
            color: 16711680,
            footer:  {
            text: "MAC",
           },
        }
    ]
    let discordId = logData.discord.replace('discord:', '');
    let discordPing = `<@${discordId}>`
    let data = JSON.stringify({ username: "[MAC]", avatar_url: "https://i.imgur.com/lxs9IhU.png", content: discordPing, embeds: embeds });

    var config = {
       method: "POST",
       url: webhook,
       headers: { "Content-Type": "application/json" },
       data: data,
    };
    
    axios(config)
       .then((response) => {
          console.log(response)
          return response;
       })
       .catch((error) => {
         console.error("BLAD TAKI:", error);
         return error;
    });
};


const sendLogToDeleteVehicle = (logData, webhook, plate, adminData) => {
    let embeds = [
        {
          title: `USUNIĘTO SAMOCHÓD O REJESTRACJI: **${plate}** `,
          color: 5174599,
          footer: {
            text: ``,
          },
          description : `\`\`\`${logData}\`\`\``,
          fields: [
            {
              name: "Administrator",
              value: `${adminData.name} | ${adminData.discord_id}`
            },
          ],
        },
      ];
    
    let data = JSON.stringify({ embeds });
    
    var config = {
       method: "POST",
       url: webhook,
       headers: { "Content-Type": "application/json" },
       data: data,
    };
    
    axios(config)
       .then((response) => {
          console.log(response)
          return response;
       })
       .catch((error) => {
         console.error("BLAD TAKI:", error);
         return error;
    });
};


const sendLogToStoreVehicle = (id, model, plate, isDonator, webhook, adminData) => {
    let embeds = [
        {
          title: `DODANO SAMOCHÓD O REJESTRACJI: **${plate}** `,
          color: 5174599,
          footer: {
            text: ``,
          },
          description : `MODEL: ${model}\nHEX: ${id}\nPLATE: ${plate}\n DONATOR: ${isDonator}`,
          fields: [
            {
              name: "Administrator",
              value: `${adminData.name} | ${adminData.discord_id}`
            },
          ],
        },
      ];
    
    let data = JSON.stringify({ embeds });
    
    var config = {
       method: "POST",
       url: webhook,
       headers: { "Content-Type": "application/json" },
       data: data,
    };
    
    axios(config)
       .then((response) => {
          console.log(response)
          return response;
       })
       .catch((error) => {
         console.error("BLAD TAKI:", error);
         return error;
    });
};