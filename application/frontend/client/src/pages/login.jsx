import React from "react";
// import "bootstrap/dist/css/bootstrap.css";

import "./Login.css";

export default function LoginPage() {
  return (
    <>
      <div className="back">
        <div className="Auth-form-container">
          <form className="Auth-form">
            <div className="Auth-form-content">
              <div className="form-group mt-3">
                <label> User Name</label>
                <input
                  type="text"
                  id="user"
                  className="form-control mt-1"
                  autoComplete="off"
                  placeholder="Enter User Name"
                  required
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  id="pwd"
                  className="form-control mt-1"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="d-grid gap-2 mt-3 mb-4">
                <button type="submit" className="btn btn-primary">
                  Sign In
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
