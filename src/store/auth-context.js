import React, { useState, useEffect } from "react";
//자주바뀌는 state는 useContext가 적절하지않음 ex)UI/Button
//props체인이 긴 경우 사용 적절.

const AuthContext = React.createContext({
	isLoggedIn: false,
	onLogout: () => {},
	onLogin: (email, password) => {},

});

export const AuthContextProvider = (props) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	//dependency 변화 시 함수를 실행->jsx(처음에도 실행)
	//아래처럼 할 시, App이 렌더링될 때마다 실행이 아니라,
	//dependency가 없으므로, 처음에 딱 한번만 실행되 side effect 방지
	useEffect(() => {
		const storedUserInfo = localStorage.getItem("isLoggedIn");
		if (storedUserInfo === "1") setIsLoggedIn(true);
	}, []);

	const loginHandler = (email, password) => {
		// We should of course check email and password
		// But it's just a dummy/ demo anyways
		localStorage.setItem("isLoggedIn", "1");
		setIsLoggedIn(true);
	};

	const logoutHandler = () => {
		localStorage.removeItem("isLoggedIn");
		setIsLoggedIn(false);
	};

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: isLoggedIn,
				onLogout: logoutHandler,
				onLogin: loginHandler,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};


export default AuthContext;
