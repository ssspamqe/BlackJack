package com.ssspamqe.BlackJack.newConnectionHandler;

import java.util.List;

public class ConnectionInfo {

    private String username;
    private String role;

    public ConnectionInfo(String username, String role) {
        this.username = username;
        this.role = role;
    }

    public ConnectionInfo(List<String> data){
        this.username = data.get(0);
        this.role = data.get(1);
    }

    @Override
    public String toString(){
        return username + " "+ role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
