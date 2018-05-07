function readPrimitiveBackup
	parametersPath = 'cone.txt';
	centroidsPath = 'ecentroid.txt';
	A = dlmread(parametersPath,','); A(8) = 2;
	points = dlmread(centroidsPath,',',1.0);
	primitive(2) = size(points,1);
	switch A(8)
		% plane
		case 0
		primitive(1) = 0;
		primitive(3:5) = A(1:3);
		primitive(6:8) = A(4:6);
		% cylinder
		case 1
		primitive(1) = 2;
		primitive(3:5) = A(4:6);
		primitive(6:8) = A(1:3);
		primitive(9) = A(7);
		% cone
		case 2
		primitive(1) = 3;
		primitive(3:5) = A(4:6);
		primitive(6:8) = A(1:3);
		primitive(9) = A(7);
		% sphere
		case 3
		primitive(1) = 1;
		primitive(3:5) = A(1:3);
		primitive(6) = A(7);
		otherwise
		return;
	end
	outputPrimitive = fitPrimitive(primitive, points);
	fid = fopen(resultPath, 'wt');
	for i = 1:size(outputPrimitive, 1)
	    fprintf(fid, '%f\n', outputPrimitive(i,:));
	end
	fclose(fid);
	exit;
end

