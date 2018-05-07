function [dx, dy, dz, px, py, pz, rmajor, rminor] = fitTorus(P, dx, dy, dz, px, py, pz, rmajor, rminor)
% Fit an apple-torus to n 3D-points in P given the initial estimate of it
% Input: P, dx, dy, dz, px, py, pz, rmajor, rminor
%     P : list of 3D-points, is of size n * 3
%     dx, dy, dz : the torus's axis
%     px, py, pz : the torus's center
%     rmajor, rminor : the torus's major and minor angles (rmajor > rminor)
% Output: dx, dy, dz, px, py, pz, rmajor, rminor
    torus_axis = [dx, dy, dz];
    torus_center = [px, py, pz];
    
    alpha = rand(1) / (2 * pi) - pi;
    beta = rand(1) / (2 * pi) - pi;
    gamma = rand(1) / (2 * pi) - pi;
    shift_vector = rand(1, 3) * 3;
    rx = [1, 0, 0; 0, cos(alpha), -sin(alpha); 0, sin(alpha), cos(alpha)];
    ry = [cos(beta), 0, sin(beta); 0, 1, 0; -sin(beta), 0, cos(beta)];
    rz = [cos(gamma), -sin(gamma), 0; sin(gamma), cos(gamma), 0; 0 0 1];
    rotation_matrix = rx * ry * rz;
    P = P * rotation_matrix' + repmat(shift_vector, size(P, 1), 1);
    torus_axis = torus_axis * rotation_matrix';
    torus_center = torus_center * rotation_matrix' + shift_vector;
    oproj = -dot(-torus_center, torus_axis, 2) * torus_axis;
    e = oproj - torus_center;
    e = e / norm(e);
    r = torus_center + rmajor * e;
    n = r / norm(r);
    rho = norm(r) - rminor;
    phi = atan2(n(2), n(1));
    zeta = acos(n(3));
    sigma = atan2(torus_axis(2), torus_axis(1));
    tau = acos(torus_axis(3));
    k = 1 / rminor;
    z = [torus_axis', -n'] \ (-torus_center');
    s = 1 / (z(2) - rho);    
    options = optimset('Jacobian', 'on', 'Algorithm', 'trust-region-reflective', 'display', 'off');
    out = lsqnonlin(@(x) distance2torus(x, P), [rho phi zeta sigma tau k s], [-Inf -pi 0 -pi 0 0 0], [Inf pi pi pi pi Inf Inf], options);
    rho = out(1); phi = out(2); zeta = out(3); sigma = out(4); tau = out(5); k = out(6); s = out(7);
    n(1) = cos(phi) * sin(zeta);
    n(2) = sin(phi) * sin(zeta);
    n(3) = cos(zeta);
    torus_axis(1) = cos(sigma) * sin(tau);
    torus_axis(2) = sin(sigma) * sin(tau);
    torus_axis(3) = cos(tau);
    rmajor = abs(1 / s - 1 / k) * norm(cross(n, torus_axis, 2));
    rminor = 1 / k;
    m = (rho + 1 / s) * n;
    r = (rho + 1 / k) * n;
    torus_center = m + dot(r - m, torus_axis, 2) * torus_axis;
    torus_axis = torus_axis * rotation_matrix;
    torus_center = (torus_center - shift_vector) * rotation_matrix;
    dx = torus_axis(1); dy = torus_axis(2); dz = torus_axis(3);
    px = torus_center(1); py = torus_center(2); pz = torus_center(3);
end
