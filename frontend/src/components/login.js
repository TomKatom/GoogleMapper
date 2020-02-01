import React, {Component} from 'react'
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from "@material-ui/core/IconButton";
import {Dialpad, Visibility, VisibilityOff} from "@material-ui/icons";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        display: 'flex',
        flexWrap: 'wrap'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    }
}));


export function Login()  {
    const classes = useStyles()
    const [values, setValues] = React.useState({
        phoneNumber: '',
        password: '',
        showPassword: false,
    });
    const handleChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };
    const handleSubmit = event => {
        let details = {phoneNumber: values.password, password: values.password};
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        fetch('http://localhost:5000/login', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: formBody
        }).then((response) => {
            JSON.parse(response.body).then(data => console.log(data));
        }).catch((response) => {
            console.log(response.body);
        });
        event.preventDefault();
    };
       return (
      <React.Fragment>
          <Card variant="outlined" className={classes.root}>
              <CardActions>
                  <form onSubmit={handleSubmit} noValidate autoComplete="off" >
                      <FormControl >
                          <InputLabel id="phoneNumber" >Phone Number</InputLabel>
                          <OutlinedInput
                              className={classes.textField}
                              id="outlined-adornment-text"
                              onChange={handleChange('phoneNumber')}
                              value={values.phoneNumber}
                              fullWidth

                              startAdornment = {
                                  <InputAdornment position="start">
                                    <Icon>
                                        <Dialpad />
                                    </Icon>
                              </InputAdornment>
                              }
                          />
                      </FormControl>
                      <FormControl >
                          <InputLabel id="password" >Password</InputLabel>
                          <OutlinedInput
                              id="outlined-adornment-password"
                              className={classes.textField}
                              type={values.showPassword ? 'text' : 'password'}
                              value={values.password}
                              onChange={handleChange('password')}
                              fullWidth
                              endAdornment={
                                  <InputAdornment position="start">
                                      <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={handleClickShowPassword}
                                          onMouseDown={handleMouseDownPassword}
                                          edge="end"
                                      >
                                          {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                      </IconButton>
                                  </InputAdornment>
                              }
                          />
                      </FormControl>
                      <Button variant="contained" type="submit" className={classes.textField}>
                          Login
                      </Button>
                  </form>
              </CardActions>
          </Card>
      </React.Fragment>
      )
}

