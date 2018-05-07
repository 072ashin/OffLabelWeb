import numpy as np


def distance2cylinder(x, P):
    '''
    % Calculate modified signed distance of each point in each row of P to the cylinder
% parameterized by x = (rho phi zeta alpha k)
% Input:
%     x : tuple of 5 real numbers (rho phi zeta alpha k) describing the cylinder
%     P : n queries of 3-D points of size n * 3
% Output:
%     F is of size n * 1 are the modified signed distances corresponding to each point in P
%     J is of size n * 5 are the Jacobian of F with respect to x
    :param x:
    :param P:
    :return:
    '''
    rho = x[0]
    phi = x[1]
    zeta = x[2]
    alpha = x[3]
    k = x[4]

    n = np.array([np.cos(phi) * np.sin(zeta), np.sin(phi) * np.sin(zeta), np.cos(zeta)])

    if np.abs(zeta) < 1e-12:
        n_phi = np.array([0, np.sign(np.cos(phi), 0)])
    else:
        n_phi = np.array([-np.sin(phi) * np.sin(zeta), np.cos(phi) * np.sin(zeta), 0])

    n_zeta = np.array([np.cos(phi) * np.cos(zeta), np.sin(phi) * np.cos(zeta), -np.sin(zeta)])
    n_phi_bar = np.cross(n_zeta, n)
    n_phi_bar = n_phi_bar / np.sqrt(np.sum(n_phi_bar ** 2))

    if np.inner(n_phi_bar, n_phi) < 0:
        n_phi_bar = -n_phi_bar
    n_zeta_phi = np.array([-np.sin(phi) * np.cos(zeta), np.cos(phi) * np.cos(zeta), 0])
    n_phi_phi_bar = np.array([-np.cos(phi), np.sin(phi), 0])
    a = np.dot(n_zeta, np.cos(alpha)) + np.dot(n_phi_bar, np.sin(alpha))
    tmp1 = P - rho * np.tile(n, [P.shape[0], 1])
    tmp2 = np.tile(a, [P.shape[0], 1])
    tmp3 = np.cross(tmp1, tmp2, axis=1)
    tmp3 = tmp3 ** 2
    tmp4 = (k / 2) * np.sum(tmp3, axis=1)
    tmp5 = np.dot(tmp1, n.T)
    F = tmp4 - tmp5
    return F


def JacobianofCylinder(x, P):

    rho = x[0]
    phi = x[1]
    zeta = x[2]
    alpha = x[3]
    k = x[4]

    n = np.array([np.cos(phi) * np.sin(zeta), np.sin(phi) * np.sin(zeta), np.cos(zeta)])

    if np.abs(zeta) < 1e-12:
        n_phi = np.array([0, np.sign(np.cos(phi), 0)])
    else:
        n_phi = np.array([-np.sin(phi) * np.sin(zeta), np.cos(phi) * np.sin(zeta), 0])

    n_zeta = np.array([np.cos(phi) * np.cos(zeta), np.sin(phi) * np.cos(zeta), -np.sin(zeta)])
    n_phi_bar = np.cross(n_zeta, n)
    n_phi_bar = n_phi_bar / np.sqrt(np.sum(n_phi_bar ** 2))

    if np.inner(n_phi_bar, n_phi) < 0:
        n_phi_bar = -n_phi_bar
    n_zeta_phi = np.array([-np.sin(phi) * np.cos(zeta), np.cos(phi) * np.cos(zeta), 0])
    n_phi_phi_bar = np.array([-np.cos(phi), np.sin(phi), 0])
    a = np.dot(n_zeta, np.cos(alpha)) + np.dot(n_phi_bar, np.sin(alpha))
    s = P.shape[0]
    n=np.matrix(n)
    n_phi=np.matrix(n_phi)
    J = np.zeros([s, 5])
    J= np.matrix(J)
    J[:,0]=k*(np.tile(rho,[s,1]) - P*n.T)+np.ones([s,1])

    jtmp1=rho*P*n_phi.T+(P*np.matrix(a).T)
    jtmp2=P*np.matrix(n_zeta_phi*np.cos(alpha) + n_phi_phi_bar*np.sin(alpha)).T
    J[:,1]=-k*np.multiply(jtmp1,jtmp2)- P* np.matrix(n_phi).T

    jtmp1=np.multiply(P*np.matrix(a).T,P*np.matrix(n).T)*np.cos(alpha)-rho*P*np.matrix(n_zeta).T
    J[:,2]=k*jtmp1-P*np.matrix(n_zeta).T

    jtmp1=k*(P*np.matrix(a).T)
    jtmp2=P*np.matrix(n_zeta*np.sin(alpha)-n_phi_bar*np.cos(alpha)).T
    J[:,3]=np.multiply(jtmp1,jtmp2)


    jtmp1=np.matrix(np.sum(P**2,axis=1)).T
    jtmp2=2 * rho * P * np.matrix(n).T
    jtmp3=np.array(P*np.matrix(a).T)**2
    jtmp4 = np.tile(rho*rho,[s,1])
    J[:,4]= (jtmp1-jtmp2-jtmp3+jtmp4)/2
    J=np.array(J)
    return J