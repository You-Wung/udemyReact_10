import React, {
	useState,
	useEffect,
	useReducer,
	useContext,
	useRef,
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";

//안에 사용하는 것들은 컴포넌트 안에서 사용안하기에, 컴포넌트 외부 함수선언
//state: 최근스냅샷, action: vlaue와 isValid를 말함
const passwordReducer = (state, action) => {
	if (action.type === "USER_INPUT") {
		return { value: action.val, isValid: action.val.trim().length > 6 };
	} else if (action.type === "INPUT_BLUR") {
		return { value: state.value, isValid: state.value.trim().length > 6 };
	}
	return { value: "", isValid: false };
};
const emailReducer = (state, action) => {
	if (action.type === "USER_INPUT") {
		return { value: action.val, isValid: action.val.includes("@") };
	} else if (action.type === "INPUT_BLUR") {
		return { value: state.value, isValid: state.value.includes("@") };
	}
	return { value: "", isValid: false };
};

const Login = (props) => {
	//const [enteredEmail, setEnteredEmail] = useState("");
	//const [emailIsValid, setEmailIsValid] = useState();
	//const [enteredPassword, setEnteredPassword] = useState("");
	//const [passwordIsValid, setPasswordIsValid] = useState();
	const [formIsValid, setFormIsValid] = useState(false);

	const [emailState, dispatchEmail] = useReducer(emailReducer, {
		value: "",
		isValid: undefined,
	});

	const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
		value: "",
		isValid: undefined,
	});

	const authCtx = useContext(AuthContext);

	const emailInputRef = useRef();
	const passwordInputRef = useRef();

	//엘리어스: state의 속성을 꺼내온다.
	const { isValid: emailIsValid } = emailState;
	const { isValid: passwordIsValid } = passwordState;

	//dependency 중에 하나라도 변화되지않는다면, 아래 함수는 실행되지않음.
	useEffect(() => {
		const identifier = setTimeout(() => {
			console.log("Run");
			setFormIsValid(emailIsValid && passwordIsValid);
		}, 500);
		return () => {
			console.log("Clean");
			clearTimeout(identifier);
		}; //cleanup, useEffect호출 전에 실행됨(처음 실행X)
	}, [emailIsValid, passwordIsValid]);

	const emailChangeHandler = (event) => {
		dispatchEmail({ type: "USER_INPUT", val: event.target.value });

		setFormIsValid(emailState.isValid && passwordState.isValid);
	};

	const passwordChangeHandler = (event) => {
		dispatchPassword({ type: "USER_INPUT", val: event.target.value });
		setFormIsValid(emailState.isValid && passwordState.isValid);
	};

	const validateEmailHandler = () => {
		dispatchEmail({ type: "INPUT_BLUR" });
	};

	const validatePasswordHandler = () => {
		dispatchPassword({ type: "INPUT_BLUR" });
	};

	const submitHandler = (event) => {
		event.preventDefault();
		if (formIsValid) {
			authCtx.onLogin(emailState.value, passwordState.value);
		} else if (!emailIsValid) {
			emailInputRef.current.focus();
		} else {
			passwordInputRef.current.focus();
		}
	};

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				<Input
					ref={emailInputRef}
					id="email"
					label="E-Mail"
					type="email"
					isValid={emailIsValid}
					value={emailState.value}
					onChange={emailChangeHandler}
					onBlur={validateEmailHandler}
				/>
				<Input
					ref={passwordInputRef}
					id="passwrod"
					label="Password"
					type="password"
					isValid={passwordIsValid}
					value={passwordState.value}
					onChange={passwordChangeHandler}
					onBlur={validatePasswordHandler}
				/>
				<div className={classes.actions}>
					<Button type="submit" className={classes.btn}>
						Login
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default Login;
