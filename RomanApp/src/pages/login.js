import React, { Component } from 'react';
import jwt from 'jwt-decode';

import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    Alert
} from "react-native";

import { DefaultStyles, FeedBackStyles, FormularioStyles } from '../assets/estilizacao/padrao.js';
import api from '../services/api.js';
import {TokenValido} from '../services/auth.js';


class Login extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            email: "", senha: "",
            erro: ""
        };
        console.disableYellowBox = true;
    }

    componentDidMount(){
        TokenValido().then(
            valido => {
                if (valido) {
                    this.props.navigation.navigate("MainNavigator");
                }
            }
        )
        

    }

    _logando = async () => {
        const respostaLogin = await api.post("/api/Usuarios/login",
            {
                email: this.state.email,
                senha: this.state.senha
            }
        )
        //console.warn(respostaLogin.data.token)
        try {
            const token = respostaLogin.data.token;
            AsyncStorage.setItem('userToken', token);
            //console.warn(await AsyncStorage.getItem("userToken"))
            var decode = jwt(token).Role;
            //console.warn(decode);
            if (decode.Role === "Administrador") {
                this.props.navigation.navigate("AdminNavigator");
            }
            this.props.navigation.navigate("MainNavigator");
        } catch{
            this.setState({ erro: respostaLogin.data.Usuario })
        }

    }


    render() {
        return (

            <View style={styles.main}>
                {/* <View style={styles.container}> */}
                {/* </View> */}

                <ImageBackground source={require("../assets/img/160.jpg")} style={styles.backgroundImage}>
                    <View style={FormularioStyles.mainContainer}>
                        <View style={FormularioStyles.corpo}>
                            <View>
                                <Text style={DefaultStyles.tituloPagina}>Login</Text>
                            </View>
                            <View>
                                <Text style={FormularioStyles.labelInput}>Email:</Text>
                                <TextInput
                                    placeholder="email"
                                    textContentType='emailAddress'
                                    style={FormularioStyles.inputArredondado}
                                    onChangeText={email => this.setState({ email })}
                                    placeholderTextColor='black'
                                    value={this.state.email}
                                />
                                <Text style={FormularioStyles.labelInput}>Senha:</Text>
                                <TextInput
                                    placeholder="senha"
                                    textContentType='password'
                                    style={FormularioStyles.inputArredondado}
                                    onChangeText={senha => this.setState({ senha })}
                                    value={this.state.senha}
                                    placeholderTextColor='black'
                                />

                                <TouchableOpacity
                                    onPress={this._logando}
                                    style={{ ...FormularioStyles.inputArredondado, ...FormularioStyles.botaoSubmit }}
                                    activeOpacity={0.5}
                                >
                                    <Text style={FormularioStyles.textoBotaoSubmit}>Login</Text>
                                </TouchableOpacity>

                                <Text style={FeedBackStyles.mensagemErro}>{this.state.erro}</Text>
                            </View>
                        </View>
                    </View>

                </ImageBackground>

            </View>
        )
    }

}

const styles = StyleSheet.create({
    main: {
        width: '100%',
        alignSelf: 'flex-start',
        padding: 0,
        margin: 0,
        display: "flex"
    },
    backgroundImage: {
        width: "100%",
        height: '100%',
    }
})

export default Login