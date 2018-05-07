import numpy as np


def distance2cone(x, P):
    rho = x[0]
    phi = x[1]
    zeta = x[2]
    sigma = x[3]
    tau = x[4]
    k = x[5]

    s = P.shape[0]
    n = np.array([np.cos(phi) * np.sin(zeta), np.sin(phi) * np.sin(zeta), np.cos(zeta)])
    a = np.array([np.cos(sigma) * np.sin(tau), np.sin(sigma) * np.sin(tau), np.cos(tau)])
    p_hat = P - rho * np.tile(n, [s, 1])
    n_cross_a_square = np.dot((np.cross(n, a)), (np.cross(n, a)))
    lam_bda = (n_cross_a_square * np.sum(p_hat ** 2, axis=1) - np.sum((p_hat * np.tile(a, [s, 1])), axis=1) ** 2) / 2
    xi = np.sum(-(p_hat * np.tile(n, [s, 1])) * n_cross_a_square, axis=1)
    mu = np.sum((p_hat * np.tile(a, [s, 1])), axis=1) * np.dot(n, a)
    eta = np.tile(n_cross_a_square, [s, 1])
    F = k * lam_bda + xi
    F1 = (k * mu + np.tile(n_cross_a_square, [1, s]))
    F = F / F1
    F=F[0]
    return F


def JacobianofCone(x, P):
    rho = x[0]
    phi = x[1]
    zeta = x[2]
    sigma = x[3]
    tau = x[4]
    k = x[5]

    s = P.shape[0]
    n = np.array([np.cos(phi) * np.sin(zeta), np.sin(phi) * np.sin(zeta), np.cos(zeta)])
    a = np.array([np.cos(sigma) * np.sin(tau), np.sin(sigma) * np.sin(tau), np.cos(tau)])
    p_hat = P - rho * np.tile(n, [s, 1])
    n_cross_a_square = np.dot((np.cross(n, a)), (np.cross(n, a)))
    lam_bda = (n_cross_a_square * np.sum(p_hat ** 2, axis=1) - np.sum((p_hat * np.tile(a, [s, 1])), axis=1) ** 2) / 2
    xi = np.sum(-(p_hat * np.tile(n, [s, 1])), axis=1) * n_cross_a_square
    mu = np.sum((p_hat * np.tile(a, [s, 1])), axis=1) * np.dot(n, a)
    eta = np.tile(n_cross_a_square, [s, 1])

    J = np.zeros([s, 6])
    J = np.matrix(J)
    n_phi = np.array([-np.sin(phi) * np.sin(zeta), np.cos(phi) * np.sin(zeta), 0])
    n_zeta = np.array([np.cos(phi) * np.cos(zeta), np.sin(phi) * np.cos(zeta), -np.sin(zeta)])
    a_sigma = np.array([-np.sin(sigma) * np.sin(tau), np.cos(sigma) * np.sin(tau), 0])
    a_tau = np.array([np.cos(sigma) * np.cos(tau), np.sin(sigma) * np.cos(tau), -np.sin(tau)])
    lam_bda_rho = rho * (n_cross_a_square - 2 * (np.dot(n, a)) ** 2) + 2 * np.sum(P * np.tile(a, [s, 1]),
                                                                                  axis=1) * np.dot(n, a) - np.sum(
        P * np.tile(n, [s, 1]), axis=1) * n_cross_a_square
    lam_bda_phi = -np.dot(n_phi, a) * np.dot(n, a) * np.sum(p_hat ** 2, axis=1) - rho * n_cross_a_square * np.sum(
        np.tile(n_phi, [s, 1]) * P, axis=1) + 2 * rho * np.sum(p_hat * np.tile(a, [s, 1]), axis=1) * np.dot(n_phi, a)
    lam_bda_zeta = -np.dot(n_zeta, a) * np.dot(n, a) * np.sum(p_hat ** 2, axis=1) - rho * n_cross_a_square * np.sum(
        np.tile(n_zeta, [s, 1]) * P, axis=1) + 2 * rho * np.sum(p_hat * np.tile(a, [s, 1]), axis=1) * np.dot(n_zeta, a)
    lam_bda_sigma = -(
        np.dot(n, a_sigma) * np.dot(n, a) * np.sum(p_hat ** 2, axis=1) + np.sum(p_hat * np.tile(a, [s, 1]),
                                                                                axis=1) * np.sum(
            p_hat * np.tile(a_sigma, [s, 1]), axis=1))
    lam_bda_tau = -(
        np.dot(n, a_tau) * np.dot(n, a) * np.sum(p_hat ** 2, axis=1) + np.sum(p_hat * np.tile(a, [s, 1]),
                                                                              axis=1) * np.sum(
            p_hat * np.tile(a_tau, [s, 1]), axis=1))

    xi_rho = np.tile(2 * n_cross_a_square, [s, 1])
    xi_phi = 2 * np.dot(n_phi, a) * np.dot(n, a) - np.sum(p_hat * np.tile(n_phi, [s, 1]), axis=1) * n_cross_a_square
    xi_zeta = 2 * np.dot(n_zeta, a) * np.dot(n, a) - np.sum(p_hat * np.tile(n_zeta, [s, 1]), axis=1) * n_cross_a_square
    xi_sigma = np.sum(p_hat * np.tile(n, [s, 1]), axis=1) * np.dot(n, a_sigma) * np.dot(n, a)
    xi_tau = np.sum(p_hat * np.tile(n, [s, 1]), axis=1) * np.dot(n, a_tau) * np.dot(n, a)

    mu_rho = np.tile(-np.dot(n, a) ** 2, [s, 1])
    mu_phi = np.dot(n_phi, a) * np.sum((P - 2 * rho * np.tile(n, [s, 1])) * np.tile(a, [s, 1]), axis=1)
    mu_zeta = np.dot(n_zeta, a) * np.sum((P - 2 * rho * np.tile(n, [s, 1])) * np.tile(a, [s, 1]), axis=1)
    mu_sigma = np.sum(p_hat * np.tile(a_sigma, [s, 1]), axis=1) * np.dot(n, a) + np.sum(p_hat * np.tile(a, [s, 1]),
                                                                                        axis=1) * np.dot(n, a_sigma)
    mu_tau = np.sum(p_hat * np.tile(a_tau, [s, 1]), axis=1) * np.dot(n, a) + np.sum(p_hat * np.tile(a, [s, 1]),
                                                                                    axis=1) * np.dot(n, a_tau)

    eta_phi = np.tile(-2 * np.dot(n_phi, a) * np.dot(n, a), [s, 1])
    eta_zeta = np.tile(-2 * np.dot(n_zeta, a) * np.dot(n, a), [s, 1])
    eta_sigma = np.tile(-2 * np.dot(n, a_sigma) * np.dot(n, a), [s, 1])
    eta_tau = np.tile(-2 * np.dot(n, a_tau) * np.dot(n, a), [s, 1])

    tmp = ((lam_bda_rho * mu - lam_bda * mu_rho.T) * (k ** 2) + (
        lam_bda_rho * eta.T + xi_rho.T * mu - xi * mu_rho.T) * k + xi_rho.T * eta.T) / ((mu * k + eta.T) ** 2)
    J[:, 0] = np.matrix(tmp).T
    tmp = ((lam_bda_phi * mu - lam_bda * mu_phi) * (k ** 2) + (
        lam_bda_phi * eta.T + xi_phi * mu - lam_bda * eta_phi.T - xi * mu_phi) * k + xi_phi * eta.T - xi * eta_phi.T) / (
              (mu * k + eta.T) ** 2)
    J[:, 1] = np.matrix(tmp).T
    tmp = ((lam_bda_zeta * mu - lam_bda * mu_zeta) * (k ** 2) + (
        lam_bda_zeta * eta.T + xi_zeta * mu - lam_bda * eta_zeta.T - xi * mu_zeta) * k + xi_zeta * eta.T - xi * eta_zeta.T) / (
              (mu * k + eta.T) ** 2)
    J[:, 2] = np.matrix(tmp).T
    tmp = ((lam_bda_sigma * mu - lam_bda * mu_sigma) * (k ** 2) + (
        lam_bda_sigma * eta.T + xi_sigma * mu - lam_bda * eta_sigma.T - xi * mu_sigma) * k + xi_sigma * eta.T - xi * eta_sigma.T) / (
              (mu * k + eta.T) ** 2)
    J[:, 3] = np.matrix(tmp).T
    tmp = ((lam_bda_tau * mu - lam_bda * mu_tau) * (k ** 2) + (
        lam_bda_tau * eta.T + xi_tau * mu - lam_bda * eta_tau.T - xi * mu_tau) * k + xi_tau * eta.T - xi * eta_tau.T) / (
              (mu * k + eta.T) ** 2)
    J[:, 4] = np.matrix(tmp).T
    tmp = (lam_bda * eta.T - mu * xi) / ((mu * k + eta.T) ** 2)
    J[:, 5] = np.matrix(tmp).T
    J=np.array(J)
    return J
